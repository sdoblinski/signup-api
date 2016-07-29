"use strict";

function contentType(req, res, next) {
	if(req.get("Content-Type") != "application/json")
		return res.status(406).send({mensagem: "Requisição inválida"});
	next();
}

function notFound(req, res, next) {
	const err = new Error("Não encontrado");
	err.status = 404;
	next(err);
}

function errorHandler(err, req, res, next){
	if (err.name === "UnauthorizedError") err.message = "Não autorizado";
	res.status(err.status || 500).send({
		mensagem: err.message
	});
}

module.exports = {
	contentType,
	notFound,
	errorHandler
};