"use strict";

process.env.NODE_ENV = "test";

const chai = require("chai"),
	should = chai.should();
const chaiHttp = require("chai-http");
const httpMocks = require("express-mocks-http");
const chaiAsPromised = require("chai-as-promised");
const server = require("../app");

const User = require("../models/user");
const signup = require("../services/user/signup");
const signin = require("../services/user/signin");
const getUuid = require("../services/user/getuuid");

const signupData = {
	name: "Simei Doblinski", 
	password: "password123", 
	email: "simeidoblinski@gmail.com",
	phones: ["11999999999","11555555555"]
};
const signinData = {
	email: "simeidoblinski@gmail.com", 
	password: "password123"
};
let token,
	uuid,
	req,
	res,
	signupUser,
	signinUser,
	getUuidUser;

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe("Testes unitários", function() {

	before(function(done){
		User.collection.drop();
		done();
	});
	beforeEach(function(done){
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		done();
	});

	it("Método signup: deve resolver requisição de acordo com modelo", function(){
		req.body = signupData;
		return signup(req, res).then(u => signupUser = u).should.be.fulfilled;
	});

	it("Método signup: deve rejeitar e-mail já existente", function(){
		req.body = signupData;
		return signup(req, res).then().should.be.rejectedWith("E-mail já existente");
	});

	it("Método signup: deve retornar novo usuário de acordo com modelo", function(done) {
		signupUser.should.be.a("object");
		signupUser.should.have.property("uuid");
		signupUser.should.have.property("createDate");
		signupUser.should.have.property("updateDate");
		signupUser.should.have.property("lastLogin");
		signupUser.should.have.property("token");
		signupUser.should.have.property("name");
		signupUser.should.have.property("password");
		signupUser.should.have.property("email");
		signupUser.should.have.property("phones");
		done();
	});

	it("Método signin: deve resolver requisição de acordo com modelo", function(){
		req.body = signinData;
		return signin(req, res).then(u => signinUser = u).should.be.fulfilled;
	});

	it("Método signin: deve rejeitar requisição diferente do modelo", function(){
		return signin(req, res).then().should.be.rejectedWith("Usuário e/ou senha inválidos");
	});

	it("Método signin: deve reportar erro em falha de autenticação", function(){
		req.body = {
			email: "simeidoblinski@gmail.com", 
			password: "senhaErrada"
		};
		return signin(req, res).then().should.be.rejectedWith("Usuário e/ou senha inválidos");
	});

	it("Método signin: deve retornar usuário de acordo com modelo", function(done) {
		signinUser.should.be.a("object");
		signinUser.should.have.property("uuid");
		signinUser.should.have.property("createDate");
		signinUser.should.have.property("updateDate");
		signinUser.should.have.property("lastLogin");
		signinUser.should.have.property("token");
		signinUser.should.have.property("name");
		signinUser.should.have.property("password");
		signinUser.should.have.property("email");
		signinUser.should.have.property("phones");
		done();
	});

	it("Método getUuid: deve resolver requisição de acordo com modelo", function(){
		req.params = signinUser;
		return getUuid(req, res).then(u => getUuidUser = u).should.be.fulfilled;
	});

	it("Método getUuid: deve rejeitar requisição diferente do modelo", function(){
		return getUuid(req, res).then().should.be.rejectedWith("Usuário não encontrado");
	});

	it("Método getUuid: deve retornar usuário de acordo com modelo", function(done) {
		getUuidUser.should.be.a("object");
		getUuidUser.should.have.property("uuid");
		getUuidUser.should.have.property("createDate");
		getUuidUser.should.have.property("updateDate");
		getUuidUser.should.have.property("lastLogin");
		getUuidUser.should.have.property("token");
		getUuidUser.should.have.property("name");
		getUuidUser.should.have.property("password");
		getUuidUser.should.have.property("email");
		getUuidUser.should.have.property("phones");
		done();
	});
});


describe("Testes de integração", function() {
	before(function(done){
		User.collection.drop();
		done();
	});

	it("/users/signup POST: deve reportar status 200, criar e retornar novo usuário", function(done) {
		chai.request(server)
		.post("/users/signup")
		.set({"Content-Type": "application/json"})
		.send(signupData)
		.end(function(err, res){
			uuid = res.body.uuid;
			token = res.body.token;
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("uuid");
			res.body.should.have.property("createDate");
			res.body.should.have.property("updateDate");
			res.body.should.have.property("lastLogin");
			res.body.should.have.property("token");
			res.body.should.have.property("name");
			res.body.should.have.property("password");
			res.body.should.have.property("email");
			res.body.should.have.property("phones");
			done();
		});
	});

	it("/users/signin POST: deve retornar token no header e usuário no corpo da resposta", function(done) {
		chai.request(server)
		.post("/users/signin")
		.set({
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		})
		.send(signinData)
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("uuid");
			res.body.should.have.property("createDate");
			res.body.should.have.property("updateDate");
			res.body.should.have.property("lastLogin");
			res.body.should.have.property("token");
			res.body.should.have.property("name");
			res.body.should.have.property("password");
			res.body.should.have.property("email");
			res.body.should.have.property("phones");
			done();
		});
	});

	it("/users/signin POST: deve reportar status 401 e mensagem ao falhar autenticação", function(done) {
		chai.request(server)
		.post("/users/signin")
		.set({
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		})
		.send({
			email: "usuarioInvalido", 
			password: "password123"
		})
		.end(function(err, res){
			res.should.have.status(401);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("mensagem");
			res.body.mensagem.should.equal("Usuário e/ou senha inválidos");
			done();
		});
	});

	it("/users/<id> GET: deve retornar usuário de acordo com id apontado no path", function(done) {
		chai.request(server)
		.get("/users/"+uuid)
		.set({
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		})
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("uuid");
			res.body.should.have.property("createDate");
			res.body.should.have.property("updateDate");
			res.body.should.have.property("lastLogin");
			res.body.should.have.property("token");
			res.body.should.have.property("name");
			res.body.should.have.property("password");
			res.body.should.have.property("email");
			res.body.should.have.property("phones");
			done();
		});
	});

	it("retornar 404 e mensagem em url inválida", function(done) {
		chai.request(server)
		.post("/urlinvalida")
		.set({
			"Authorization": "Bearer "+token,
			"Content-Type": "application/json"
		})
		.end(function(err, res){
			res.should.have.status(404);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("mensagem");
			res.body.mensagem.should.equal("Não encontrado");
			done();
		});
	});	

	it("retornar 401 e mensagem ao tentar acessar sem header bearer", function(done) {
		chai.request(server)
		.get("/users/123")
		.end(function(err, res){
			res.should.have.status(401);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("mensagem");
			res.body.mensagem.should.equal("Não autorizado");
			done();
		});
	});	

});