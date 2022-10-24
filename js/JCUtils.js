"use strict";

window.JCUtils = {
	location: "pt-BR",
	currency: "BRL",
	charset: "UTF-8",
	ajaxStart: undefined,
	ajaxEnd: undefined
};

String.prototype.stripTags = function(){
	return this.replace(/<.*?>/g, "");
};

function time(datetime = null, options=""){
	let result = new Date().getTime();

	if (datetime != null && datetime.toLowerCase().trim() != "now") {
		if (datetime.search(/\d{2}:\d{2}:\d{2}/g) != -1) {
			result = new Date(datetime.trim().replaceAll(/\-\:/gi, " ")).getTime();
		}
		else{
			result = new Date((datetime.trim()+" 00:00:00").replaceAll(/\-\:/gi, " ")).getTime();
		}
	}

	let aux = options.trim().split(" ");

	if (aux.length == 2) {
		let number = Number(aux[0].replaceAll(/\s/gi, ""));

		switch (aux[1].trim().toLowerCase()) {
			case "year":
			case "years":
				result = new Date(result).setFullYear(new Date(result).getFullYear() + number);
				break;
			case "month":
			case "months":
				result = new Date(result).setMonth(new Date(result).getMonth() + number);
				break;
			case "week":
			case "weeks":
				result = new Date(result).setDate(new Date(result).getDate() + (number * 7));
				break;
			case "day":
			case "days":
				result = new Date(result).setDate(new Date(result).getDate() + number);
				break;
			case "hour":
			case "hours":
				result = new Date(result).setHours(new Date(result).getHours() + number);
				break;
			case "minute":
			case "minutes":
				result = new Date(result).setMinutes(new Date(result).getMinutes() + number);
				break;
			case "second":
			case "seconds":
				result = new Date(result).setSeconds(new Date(result).getSeconds() + number);
				break;
		}
	}

	return result;
}

function date(format, timestamp = new Date().getTime()){
	let date = new Date(timestamp);

	format = format.replaceAll("%d", (date.getDate() > 9) ? date.getDate() : "0"+date.getDate());
	format = format.replaceAll("%j", date.getDate());
	format = format.replaceAll("%m", (date.getMonth()+1 > 9) ? Number(date.getMonth())+1 : "0"+(Number(date.getMonth())+1));
	format = format.replaceAll("%n", Number(date.getMonth())+1);
	format = format.replaceAll("%Y", date.getFullYear());
	format = format.replaceAll("%y", String(date.getFullYear()).substr(2));
	format = format.replaceAll("%g", (date.getHours() > 12) ? date.getHours()-12 : date.getHours());
	format = format.replaceAll("%G", date.getHours());
	format = format.replaceAll("%h", (date.getHours() > 12) ? ((date.getHours()-12 > 9) ? date.getHours()-12 : "0"+(date.getHours()-12)) : ((date.getHours() > 9) ? date.getHours() : "0"+date.getHours()));
	format = format.replaceAll("%H", (date.getHours() > 9) ? date.getHours() : "0"+date.getHours());
	format = format.replaceAll("%i", (date.getMinutes() > 9) ? date.getMinutes() : "0"+date.getMinutes());
	format = format.replaceAll("%s", (date.getSeconds() > 9) ? date.getSeconds() : "0"+date.getSeconds());
	format = format.replaceAll("%u", date.getMilliseconds());
	format = format.replaceAll("%L", (date.getFullYear() % 4 == 0) ? 1 : 0);
	format = format.replaceAll("%w", date.getDay());
	format = format.replaceAll("%W", date.toLocaleString(window.JCUtils.location, {weekday: "long"}));
	format = format.replaceAll("%F", date.toLocaleString(window.JCUtils.location, {month: "long"}));
	format = format.replaceAll("%R", date.toLocaleString(window.JCUtils.location, {weekday: "long", year: "numeric", month: "long", day: "numeric"}));
	format = format.replaceAll("%N", (date.getDay() == 0) ? 7 : date.getDay());
	format = format.replaceAll("%z", Math.round((date.getTime() - new Date(`${date.getFullYear()} 01 01 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`).getTime()) / (24 * 60 * 60 * 1000)));
	format = format.replaceAll("%a", (date.getHours() > 12) ? "pm" : "am");
	format = format.replaceAll("%A", (date.getHours() > 12) ? "PM" : "AM");

	if (
		date.getMonth() == 0 || 
		date.getMonth() == 2 || 
		date.getMonth() == 4 || 
		date.getMonth() == 6 || 
		date.getMonth() == 7 || 
		date.getMonth() == 9 || 
		date.getMonth() == 11  
	) {
		format = format.replaceAll("%t", 31);
	}
	else if (
		date.getMonth() == 3 || 
		date.getMonth() == 5 || 
		date.getMonth() == 8 || 
		date.getMonth() == 10 
	) {
		format = format.replaceAll("%t", 30);
	}
	else{
		format = format.replaceAll("%t", (date.getFullYear() % 4 == 0) ? 29 : 28);
	}

	return format;
}

function dateDiff(datetime1, datetime2, resultIn = "days"){
	let d1 = new Date((datetime1.search(/\d{2}:\d{2}:\d{2}/g) != -1) ? datetime1.trim().replaceAll(/\-\:/gi, " ") : (datetime1.trim()+" 00:00:00").replaceAll(/\-\:/gi, " "));
	let d2 = new Date((datetime2.search(/\d{2}:\d{2}:\d{2}/g) != -1) ? datetime2.trim().replaceAll(/\-\:/gi, " ") : (datetime2.trim()+" 00:00:00").replaceAll(/\-\:/gi, " "));

	let result;

	switch (resultIn.trim().toLowerCase()) {
		case "year":
		case "years":
			result = d1.getFullYear() - d2.getFullYear();
			break;
		case "month":
		case "months":
			result = (d1.getMonth()+12 * d1.getFullYear())-(d2.getMonth()+12 * d2.getFullYear());
			break;
		case "week":
		case "weeks":
			result = (d1.getTime() - d2.getTime()) / (7 * 24 * 60 * 60 * 1000);
			break;
		case "day":
		case "days":
			result = (d1.getTime() - d2.getTime()) / (24 * 60 * 60 * 1000);
			break;
		case "hour":
		case "hours":
			result = (d1.getTime() - d2.getTime()) / (60 * 60 * 1000);
			break;
		case "minute":
		case "minutes":
			result = (d1.getTime() - d2.getTime()) / (60 * 1000);
			break;
		case "second":
		case "seconds":
			result = (d1.getTime() - d2.getTime()) / 1000;
			break;
	}

	return Math.abs(Math.round(result));
}

function dateFormat(datetime, location = window.JCUtils.location, options = {}){
	let result;

	if (datetime.search(/\d{2}:\d{2}:\d{2}/g) != -1) {
		result = new Date(datetime.trim().replaceAll(/\-\:/gi, " "));
	}
	else{
		result = new Date((datetime.trim()+" 00:00:00").replaceAll(/\-\:/gi, " "));
		options = (Object.keys(options).length == 0) ? {year: "numeric", month: "numeric", day: "numeric"} : options;
	}

	return result.toLocaleString(location, options);
}

function numberFormat(number, location = window.JCUtils.location, options = {minimumFractionDigits: 2}) {
	return Number(number).toLocaleString(location, options);
}

function moneyFormat(number, location = window.JCUtils.location, currency = window.JCUtils.currency) {
	return Number(number).toLocaleString(location, {style: "currency", currency: currency});
}

function getURLParams(key = null){
	let url = new URL(window.location);
	let result = {};

	if (key != null) {
		result = url.searchParams.getAll(key);
	}
	else{
		url.searchParams.forEach(function(v, k){
			if (result[k] == undefined) {
				result[k] = v;
			}
			else if (typeof result[k] == "object") {
				result[k].push(v);
			}
			else{
				result[k] = [result[k], v];
			}
		});
	}

	return (key != null) ? ((result.length > 0) ? ((result.length == 1) ? result[0] : result) : undefined) : result;
}

function setURLParams(key, value){
	let url = new URL(window.location);
	
	if (typeof value == "object") {
		url.searchParams.delete(key);

		value.forEach(function(v){
			if (typeof v != "object") {
				url.searchParams.append(key, v);
			}
		});
	}
	else{
		url.searchParams.set(key, value);
	}

	window.history.pushState("", "", url);
}

function removeURLParams(key){
	let url = new URL(window.location);

	url.searchParams.delete(key);

	window.history.pushState("", "", url);
}

function removeAllURLParams(){
	window.history.pushState("", "", window.location.href.replace(window.location.search, ""));
}

function hasURLParams(key){
	let url = new URL(window.location);

	return url.searchParams.has(key);
}

function setCookie(key, value){
	document.cookie = key+"="+value;
}

function getCookie(key = null){
	let cookie = document.cookie.split(";");
	let result = {};
	
	let aux;
	cookie.forEach(function(v, k){
		aux = v.split("=");
		result[aux[0]] = aux[1];
	});
	
	return (key === null) ? result : result[key];
}

function empty(variable){
	switch (typeof variable) {
		case "string":
			if (variable == 0) {
				return true;
				break;
			}
			return (variable.length > 0) ? false : true;
			break;
		case "number":
			return (variable == 0 || isNaN(variable)) ? true : false;
			break;
		case "object":
			if (variable === null) {
				return true;
			}
			else{
				return (Object.keys(variable).length > 0) ? false : true;
			}
			break;
		case "undefined":
			return true;
			break;
		case "boolean":
			return (variable == false) ? true : false;
			break;
		case "function":
			return false;
			break;
		default:
			return true;
	}
}

function foreach(data, callback){
	switch (typeof data) {
		case "object":
			if (data !== null) {
				if (Array.isArray(data)) {
					for (let i=0; i < data.length; i++) {
						callback(i, data[i]);
					}
				}
				else{
					let keys = Object.keys(data);
					for (let i=0; i < keys.length; i++) {
						callback(keys[i], data[keys[i]]);
					}
				}
			}
			else{
				throw "Invalid data format in 'foreach'"; 
			}
			break;
		case "string":
			for (let i=0; i < data.length; i++) {
				callback(i, data[i]);
			}
			break;
		default:
			throw "Invalid data format in 'foreach'"; 
			break;
	}
}

function map(data, callback){
	let result = [];
	let aux;

	switch (typeof data) {
		case "object":
			if (data !== null) {
				if (Array.isArray(data)) {
					for (let i=0; i < data.length; i++) {
						aux = callback(data[i], i);
						if (aux != undefined) {
							result.push(aux);
						}
					}
				}
				else{
					let keys = Object.keys(data);
					for (let i=0; i < keys.length; i++) {
						aux = callback(data[keys[i]], keys[i]);
						if (aux != undefined) {
							result.push(aux);
						}
					}
				}
			}
			else{
				throw "Invalid data format in 'map'";
			}
			break;
		case "string":
			for (let i=0; i < data.length; i++) {
				aux = callback(data[i], i);
				if (aux != undefined) {
					result.push(aux);
				}
			}
			break;
		default:
			throw "Invalid data format in 'map'"; 
			break;
	}

	return result;
}

function objectMerge(object1, object2){
	if (
		typeof object1 === "object" && 
		typeof object2 === "object" && 
		Array.isArray(object1) == false && 
		Array.isArray(object2) == false
	) {
		let result = object2;
		let keys = Object.keys(object1);

		for (let i=0; i < keys.length; i++) {
			result[keys[i]] = object1[keys[i]];
		}

		return result;
	}
	else{
		throw "Invalid data format in 'objectMerge'"; 
	}
}

function arrayMerge(array1, array2){
	if (Array.isArray(array1) && Array.isArray(array2)) {
		let result = array1;

		for (let i=0; i < array2.length; i++) {
			if (result.includes(array2[i]) == false) {
				result.push(array2[i]);
			}
		}

		return result;
	}
	else{
		throw "Invalid data format in 'arrayMerge'"; 
	}
}

function serialize(element){
	if (element.nodeName === "FORM") {
		return new URLSearchParams(Array.from(new FormData(element))).toString();
	}
	else{
		throw "Invalid element type in 'serialize'";
	}
}

function serializeObject(element){
	if (element.nodeName === "FORM") {
		let formData = new FormData(element);
		let result = {};

		for (let key of formData.keys()) {
			result[key] = formData.get(key);
		}

		return result;
	}
	else{
		throw "Invalid element type in 'serializeObject'";
	}
}

function serializeArray(element){
	if (element.nodeName === "FORM") {
		let formData = new FormData(element);
		let result = [];

		for (let key of formData.keys()) {
			result.push({name: key, value: formData.get(key)});
		}

		return result;
	}
	else{
		throw "Invalid element type in 'serializeArray'";
	}
}

function parseXML(string){
	if (typeof string === "string") {
		return new DOMParser().parseFromString(string, "text/xml");
	}
	else{
		throw "Invalid data format in 'parseXML'";
	}
}

function parseHTML(string){
	if (typeof string === "string") {
		return new DOMParser().parseFromString(string, "text/html").firstChild.childNodes[1].childNodes;
	}
	else{
		throw "Invalid data format in 'parseHTML'";
	}
}

function parseJSON(string){
	if (typeof string === "string") {
		return JSON.parse(string);
	}
	else{
		throw "Invalid data format in 'parseJSON'";
	}
}

function stringToObject(string){
	if (typeof string === "string") {
		let object = {};
		let aux;

		if (string.search(":") !== -1) {
			if (string.search(",") !== -1) {
				string.split(",").forEach(function(obj){
					aux = obj.split(":");
					object[aux[0]] = aux[1];
				});
			}
			else{
				aux = string.split(":");
				object[aux[0]] = aux[1];
			}
		}
		else if (string.search("=") !== -1) {
			if (string.search("&") !== -1) {
				string.split("&").forEach(function(obj){
					aux = obj.split("=");
					object[aux[0]] = aux[1];
				});
			}
			else{
				aux = string.split("=");
				object[aux[0]] = aux[1];
			}
		}
		else{
			throw "String in invalid format to convert to Object in 'stringToObject'";
		}

		return object;
	}
	else{
		throw "Invalid data format in 'stringToObject'";
	}
}

function ajax(args = {}){
	var xhttp;
	var promise = new Promise(function(resolve, reject){
		try{
			xhttp = new XMLHttpRequest();
		}
		catch (e) {
			xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		}

		let method      = (typeof args.method === "string") ? args.method.toUpperCase().trim() : "GET";
		let url         = (typeof args.url === "string") ? args.url : window.location.href;
		let async       = (typeof args.async === "boolean") ? args.async : true;
		let user        = (typeof args.user === "string") ? args.user : "";
		let password    = (typeof args.password === "string") ? args.password : "";
		let dataType    = (typeof args.dataType === "string") ? args.dataType.toLowerCase().trim() : "all";

		let contentType = (typeof args.contentType === "string" || args.contentType == false) ? args.contentType : `application/x-www-form-urlencoded; charset=${window.JCUtils.charset}`;
		let headers     = (typeof args.headers === "object" && args.header !== null && !Array.isArray(args.header)) ? args.headers : undefined;
		let timeout     = (typeof args.timeout === "number" && !isNaN(args.timeout)) ? args.timeout : 30000;
		
		let success     = (typeof args.success === "function") ? args.success : undefined;
		let error       = (typeof args.error === "function") ? args.error : undefined;
		let loadstart   = (typeof args.loadstart === "function") ? args.loadstart : undefined;
		let loadend     = (typeof args.loadend === "function") ? args.loadend : undefined;
		let progress    = (typeof args.progress === "function") ? args.progress : undefined;

		let accepts = {
			all: "*/*",
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript",
			blob: "*/*"
		};

		let responseType = {
			all: "text",
			text: "text",
			html: "document",
			xml: "document",
			json: "json",
			blob: "blob"
		};

		let data;
		if (args.data !== undefined && args.data !== null && args.data !== "") {
			if (typeof args.data === "object" && !Array.isArray(args.data)) {
				if (args.data.toString() == "[object FormData]") {
					data = args.data;
				}
				else {
					let params = new URLSearchParams();
					foreach(args.data, function(key, value){
						params.append(key, value);
					});
					data = params.toString();
				}
			}
			else if (typeof args.data === "string") {
				let params = new URLSearchParams();
				foreach(args.data.replaceAll("?", "").split("&"), function(key, value){
					let aux = value.split("=");
					params.append(aux[0], aux[1]);
				});
				data = params.toString();
			}
			else{
				throw "Invalid data format in 'ajax'";
			}
		}
		else{
			data = "";
		}

		if (method === "GET") {
			xhttp.open(method, url+((data !== "") ? "?"+data : ""), async, user, password); 
		}
		else{
			xhttp.open(method, url, async, user, password); 
		}

		if (contentType !== false) {
			xhttp.setRequestHeader("Content-Type", contentType);
		}

		xhttp.setRequestHeader("Accept", (accepts[dataType] !== undefined) ? accepts[dataType] : accepts["all"]);
		xhttp.responseType = (responseType[dataType] !== undefined) ? responseType[dataType] : responseType["all"];

		xhttp.timeout = timeout;

		if (headers !== undefined) {
			foreach(headers, function(key, value){
				xhttp.setRequestHeader(key, value);
			});
		}

		xhttp.onloadstart = function(){
			if (loadstart !== undefined && typeof loadstart === "function") {
				loadstart();
			}
			else if (window.JCUtils.ajaxStart !== undefined) {
				window.JCUtils.ajaxStart();
			}
		};

		xhttp.onloadend = function(){
			if (loadend !== undefined && typeof loadend === "function") {
				loadend();
			}
			else if (window.JCUtils.ajaxEnd !== undefined) {
				window.JCUtils.ajaxEnd();
			}
		};

		xhttp.onprogress = function(){
			if (progress !== undefined && typeof progress === "function") {
				progress();
			}
		};

		xhttp.onload = function(){
			if (this.status === 200 || this.status === 204) {
				if (success !== undefined && typeof success === "function") {
					success(this.response, this.status);
				}
				else{
					resolve(this.response, this.status);
				}
			}
			else{
				if (error !== undefined && typeof error === "function") {
					error({status: this.status, statusText: this.statusText, response: this.response});
				}
				else{
					reject({status: this.status, statusText: this.statusText, response: this.response});
				}
			}
		};

		xhttp.onerror = function(){
			if (error !== undefined && typeof error === "function") {
				error({status: this.status, statusText: this.statusText, response: this.response});
			}
			else{
				reject({status: this.status, statusText: this.statusText, response: this.response});
			}
		}

		xhttp.ontimeout = function(event){
			throw `Request time has exceeded the set value of ${event.currentTarget.timeout}ms`;
		};

		xhttp.send((method !== "GET") ? data : null);
	});

	promise.abort = function(){
		xhttp.abort();
	};

	return promise;
}

function ajaxStart(callback){
	window.JCUtils.ajaxStart = callback;
}

function ajaxEnd(callback){
	window.JCUtils.ajaxEnd = callback;
}

function toast(args = {}){
	let rand = Math.ceil(Math.random() * 100000);

	let title       = (typeof args.title === "string") ? args.title.stripTags() : "";
	let message     = (typeof args.message === "string") ? args.message.stripTags() : "";
	let html        = (typeof args.html === "string") ? args.html : "";
	let type        = (typeof args.type === "string") ? args.type.toLowerCase().trim() : "default";
	let position    = (typeof args.position === "string") ? args.position.toLowerCase().trim() : "top-right";
	let rounded     = (typeof args.rounded === "boolean") ? args.rounded : true;
	let inverse     = (typeof args.inverse === "boolean") ? args.inverse : false;
	let closeButton = (typeof args.closeButton === "boolean") ? args.closeButton : true;
	let progressBar = (typeof args.progressBar === "boolean") ? args.progressBar : true;
	let time        = (typeof args.time === "number" && !isNaN(args.time) || args.time == false) ? Number(args.time) : 5000;

	let icon;
	switch (type) {
		case "success":
			icon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
					<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/>
				</svg>
			`;
			break;
		case "error":
			icon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
					<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.094l-4.157-4.104 4.1-4.141-1.849-1.849-4.105 4.159-4.156-4.102-1.833 1.834 4.161 4.12-4.104 4.157 1.834 1.832 4.118-4.159 4.143 4.102 1.848-1.849z"/>
				</svg>
			`;
			break;
		case "warning":
			icon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
					<path d="M12 5.177l8.631 15.823h-17.262l8.631-15.823zm0-4.177l-12 22h24l-12-22zm-1 9h2v6h-2v-6zm1 9.75c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25z"/>
				</svg>
			`;
			break;
		case "info":
			icon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
					<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z"/>
				</svg>
			`;
			break;
		default:
			icon = `
				<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
					<path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm0 14h-5v-1h5v1zm5-3h-10v-1h10v1zm0-3h-10v-1h10v1z"/>
				</svg>
			`;
			break;
	}

	if (document.querySelectorAll(`.jc-toast-box.${position}`).length == 0) {
		let tmp = document.createElement("div");

		tmp.classList.add("jc-toast-box");
		tmp.classList.add(position);
		document.querySelector("body").appendChild(tmp);
	}

	document.querySelector(`.jc-toast-box.${position}`).innerHTML += `
		<div id="jc-toast-${rand}" class="jc-toast show jc-toast-${type} ${(inverse == true) ? "inverse" : ""} ${(rounded == true) ? "rounded" : ""}">
			${(time > 0 && progressBar == true) ? `<div class="jc-toast-progress-bar start"></div>` : ""}
			<div class="jc-toast-main">
				<div class="jc-toast-icon">
					${icon}
				</div>
				<div class="jc-toast-content">
					${(title != "") ? `<div class="jc-toast-title">${title}</div>` : ""}
					${(message != "") ? `<div class="jc-toast-message">${message}</div>` : ""}
					${(html != "") ? `<div class="jc-toast-html">${html}</div>` : ""}
				</div>
				${(closeButton == true) ? `
					<div class="jc-toast-close">
						<div class="jc-toast-button-close" onclick="toastClose(document.querySelector('#jc-toast-${rand}'))">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
								<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
							</svg>
						</div>
					</div>
				` : ""}
			</div>
		</div>
	`;

	document.querySelector(`#jc-toast-${rand} .jc-toast-main .jc-toast-icon`).style.height = document.querySelector(`#jc-toast-${rand} .jc-toast-main .jc-toast-content`).clientHeight+"px";

	if (time > 0) {
		let count = 0;
		let progress = setInterval(function(){
			try {
				count += 0.1;
				if (count*(time/100) >= time) {
					document.querySelector(`#jc-toast-${rand} .jc-toast-progress-bar`).style.width = "100%";
					clearInterval(progress);
					toastClose(document.querySelector(`#jc-toast-${rand}`));
				}
				else{
					document.querySelector(`#jc-toast-${rand} .jc-toast-progress-bar`).style.width = count+"%";
				}
			}
			catch (e) {
				clearInterval(progress);
			}
		}, time/1000);
	}

	setTimeout(function(){
		document.querySelector(`#jc-toast-${rand}`).classList.remove("show");
	}, 400);
}

function toastClose(element = null){
	if (element === null) {
		document.querySelectorAll(".jc-toast").forEach(function(element){
			element.classList.add("close");
			setTimeout(function(){
				element.remove();
			}, 200);
		});
	}
	else {
		element.classList.add("close");
		setTimeout(function(){
			element.remove();
		}, 200);
	}
}

function popup(args = {}){
	var promise = new Promise(function(resolve, reject){
		try{
			let rand = Math.ceil(Math.random() * 100000);

			let title   = (typeof args.title === "string") ? args.title.stripTags() : "";
			let message = (typeof args.message === "string") ? args.message.stripTags() : "";
			let html    = (typeof args.html === "string") ? args.html : "";
			let type    = (typeof args.type === "string") ? args.type.toLowerCase().trim() : "";

			let alignMessage = (typeof args.alignMessage === "string") ? args.alignMessage.toLowerCase().trim() : "center";
			let alignHtml    = (typeof args.alignHtml === "string") ? args.alignHtml.toLowerCase().trim() : "left";
			let alignButtons = (typeof args.alignButtons === "string") ? args.alignButtons.toLowerCase().trim() : "center";

			let showConfirmButton  = (typeof args.showConfirmButton === "boolean") ? args.showConfirmButton : true;
			let textConfirmButton  = (typeof args.textConfirmButton === "string") ? args.textConfirmButton : "Confirm";
			let classConfirmButton = (typeof args.classConfirmButton === "string") ? args.classConfirmButton : false;
			let styleConfirmButton = (typeof args.styleConfirmButton === "string") ? args.styleConfirmButton : false;

			let showCancelButton  = (typeof args.showCancelButton === "boolean") ? args.showCancelButton : true;
			let textCancelButton  = (typeof args.textCancelButton === "string") ? args.textCancelButton : "Cancel";
			let classCancelButton = (typeof args.classCancelButton === "string") ? args.classCancelButton : false;
			let styleCancelButton = (typeof args.styleCancelButton === "string") ? args.styleCancelButton : false;

			let showCloseButton  = (typeof args.showCloseButton === "boolean") ? args.showCloseButton : true;
			let textCloseButton  = (typeof args.textCloseButton === "string") ? args.textCloseButton : "Close";
			let classCloseButton = (typeof args.classCloseButton === "string") ? args.classCloseButton : false;
			let styleCloseButton = (typeof args.styleCloseButton === "string") ? args.styleCloseButton : false;

			let orderButtons = (Array.isArray(args.orderButtons)) ? args.orderButtons : ["confirm", "cancel", "close"];

			let buttonsType = {
				confirm: `
					${(showConfirmButton === true) ? `
						<button 
							type="button" 
							id="jc-popup-confirm-button" 
							class="${(classConfirmButton !== false) ? classConfirmButton : "jc-button jc-confirm-button"}" 
							${(styleConfirmButton !== false) ? `style="${styleConfirmButton}"` : ""}
						>
							${textConfirmButton}
						</button>
					` : ""}
				`,
				cancel: `
					${(showCancelButton === true) ? `
						<button 
							type="button" 
							id="jc-popup-cancel-button" 
							class="${(classCancelButton !== false) ? classCancelButton : "jc-button jc-cancel-button"}" 
							${(styleCancelButton !== false) ? `style="${styleCancelButton}"` : ""}
						>
							${textCancelButton}
						</button>
					` : ""}
				`,
				close: `
					${(showCloseButton === true) ? `
						<button 
							type="button" 
							id="jc-popup-close-button" 
							class="${(classCloseButton !== false) ? classCloseButton : "jc-button jc-close-button"}" 
							${(styleCloseButton !== false) ? `style="${styleCloseButton}"` : ""}
						>
							${textCloseButton}
						</button>
					` : ""}
				`
			};

			let buttons = "";
			orderButtons.forEach(function(key, value){
				buttons += buttonsType[key];
			});

			let icon;
			switch (type) {
				case "success":
					icon = `
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="var(--jc-green)" viewBox="0 0 24 24">
							<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/>
						</svg>
					`;
					break;
				case "error":
					icon = `
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#var(--jc-red)" viewBox="0 0 24 24">
							<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.094l-4.157-4.104 4.1-4.141-1.849-1.849-4.105 4.159-4.156-4.102-1.833 1.834 4.161 4.12-4.104 4.157 1.834 1.832 4.118-4.159 4.143 4.102 1.848-1.849z"/>
						</svg>
					`;
					break;
				case "warning":
					icon = `
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="var(--jc-yellow)" viewBox="0 0 24 24">
							<path d="M12 5.177l8.631 15.823h-17.262l8.631-15.823zm0-4.177l-12 22h24l-12-22zm-1 9h2v6h-2v-6zm1 9.75c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25z"/>
						</svg>
					`;
					break;
				case "info":
					icon = `
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="var(--jc-cyan)" viewBox="0 0 24 24">
							<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z"/>
						</svg>
					`;
					break;
				case "message":
					icon = `
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="var(--jc-purple)" viewBox="0 0 24 24">
							<path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006zm0 14h-5v-1h5v1zm5-3h-10v-1h10v1zm0-3h-10v-1h10v1z"/>
						</svg>
					`;
					break;
				default:
					icon = "";
					break
			}

			if (document.querySelectorAll(".jc-popup-box").length == 0) {
				let tmp = document.createElement("div");

				tmp.classList.add("jc-popup-box");
				document.querySelector("body").appendChild(tmp);
			}

			if (document.querySelectorAll(".jc-popup").length > 0) {
				document.querySelectorAll(".jc-popup").forEach(function(element){
					element.remove();
				});
			}

			document.querySelector(".jc-popup-box").innerHTML += `
				<div id="jc-popup-${rand}" class="jc-popup show">
					<div class="jc-popup-backdrop"></div>
					<div class="jc-popup-content">
						${(icon != "") ? `<div class="jc-popup-icon">${icon}</div>` : ""}
						${(title != "") ? `<div class="jc-popup-title">${title}</div>` : ""}
						${(message != "") ? `<div class="jc-popup-message" style="text-align: ${alignMessage};">${message}</div>` : ""}
						${(html != "") ? `<div class="jc-popup-html" style="text-align: ${alignHtml};">${html}</div>` : ""}
						${(buttons != "") ? `<div class="jc-popup-buttons" style="text-align: ${alignButtons};">${buttons}</div>` : ""}
					</div>
				</div>
			`;

			if (showConfirmButton === true) {
				document.querySelector(`#jc-popup-${rand} #jc-popup-confirm-button`).addEventListener("click", function(){
					resolve({
						action: "confirmed",
						close: function(){
							popupClose(document.querySelector(`#jc-popup-${rand}`));
						}
					});
				});
			}

			if (showCancelButton === true) { 
				document.querySelector(`#jc-popup-${rand} #jc-popup-cancel-button`).addEventListener("click", function(){
					resolve({
						action: "canceled",
						close: function(){
							popupClose(document.querySelector(`#jc-popup-${rand}`));
						}
					});
				});
			}

			if (showCloseButton === true) {
				document.querySelector(`#jc-popup-${rand} #jc-popup-close-button`).addEventListener("click", function(){
					popupClose(document.querySelector(`#jc-popup-${rand}`));
				});
			}

			setTimeout(function(){
				document.querySelector(`#jc-popup-${rand}`).classList.remove("show");
			}, 200);
		}
		catch (e) {
			popupClose();
			reject({message: e.message, stack: e.stack});
		}
	});

	promise.close = popupClose;

	return promise;
}

function popupClose(element = null){
	if (element === null) {
		document.querySelectorAll(".jc-popup").forEach(function(element){
			element.classList.add("close");
			setTimeout(function(){
				element.remove();
			}, 200);
		});
	}
	else {
		element.classList.add("close");
		setTimeout(function(){
			element.remove();
		}, 200);
	}
}

function modal(args = {}){
	let rand = Math.ceil(Math.random() * 100000);

	let headerText = undefined; 
	let headerHTML = undefined;
	let headerStyle = undefined;
	let headerCloseButton = undefined;
	let bodyText = undefined; 
	let bodyHTML = undefined;
	let footerText = undefined; 
	let footerHTML = undefined;
	let footerAlign = undefined;
	let footerButtons = undefined;

	if (typeof args.header === "object" && !Array.isArray(args.header)) {
		headerText = (typeof args.header.text === "string") ? args.header.text.stripTags() : undefined;
		headerHTML = (typeof args.header.html === "string") ? args.header.html : undefined;
		headerStyle = (typeof args.header.style === "string") ? args.header.style : undefined;
		headerCloseButton = (typeof args.header.closeButton === "boolean") ? args.header.closeButton : undefined;
	}

	if (typeof args.body === "object" && !Array.isArray(args.body)) {
		bodyText = (typeof args.body.text === "string") ? args.body.text.stripTags() : undefined;
		bodyHTML = (typeof args.body.html === "string") ? args.body.html : undefined;
	}

	if (typeof args.footer === "object" && !Array.isArray(args.footer)) {
		footerText = (typeof args.footer.text === "string") ? args.footer.text.stripTags() : undefined;
		footerHTML = (typeof args.footer.html === "string") ? args.footer.html : undefined;
		footerAlign = (typeof args.footer.align === "string") ? args.footer.align : undefined;
		footerButtons = (typeof args.footer.buttons === "object" && Array.isArray(args.footer.buttons)) ? args.footer.buttons : undefined;
	}

	let size = "jc-modal-medium";
	if (typeof args.size === "string") {
		switch (args.size.toLowerCase().trim()) {
			case "xlarge":
				size = "jc-modal-xlarge";
				break;
			case "large":
				size = "jc-modal-large";
				break;
			case "medium":
				size = "jc-modal-medium";
				break;
			case "small":
				size = "jc-modal-small";
				break;
			default:
				size = "jc-modal-medium";
				break;
		}
	}

	let buttons = "";
	let events = [];
	if (footerButtons !== undefined) {
		footerButtons.forEach(function(data){
			let idButton = (typeof data.id === "string") ? data.id : "button-"+Math.ceil(Math.random() * 100000);
			buttons += `
				<button 
					type="button" 
					id="${idButton}" 
					class="${(typeof data.class === "string") ? data.class : "jc-button jc-button-white"}" 
					${(data.close === true) ? `onclick="modalClose(document.querySelector('#jc-modal-${rand}'))"` : ""} 
				>
					${data.text}
				</button>
			`;

			if (typeof data.click === "function") {
				events.push({
					id: idButton,
					function: data.click
				});
			}
		});
	}

	if (document.querySelectorAll(".jc-modal-box").length == 0) {
		let tmp = document.createElement("div");

		tmp.classList.add("jc-modal-box");
		document.querySelector("body").appendChild(tmp);
	}

	document.querySelector(".jc-modal-box").innerHTML += `
		<div id="jc-modal-${rand}" class="jc-modal show">
			<div class="jc-modal-backdrop"></div>
			<div class="jc-modal-content ${size}">
				<div class="jc-modal-header">
					<div class="jc-modal-title" ${(headerStyle !== undefined) ? `style="${headerStyle}"` : ""}>
						${(headerHTML !== undefined) ? headerHTML : (headerText !== undefined) ? headerText : ""}
					</div>
					${(headerCloseButton === true) ? `
						<div class="jc-modal-close-button" onclick="modalClose(document.querySelector('#jc-modal-${rand}'))">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
								<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
							</svg>
						</div>
					` : ""}
				</div>
				<div class="jc-modal-body">
					${(bodyHTML !== undefined) ? bodyHTML : (bodyText !== undefined) ? bodyText : ""}
				</div>
				<div class="jc-modal-footer" ${(footerAlign !== undefined) ? `style="text-align: ${footerAlign};"` : ""}>
					${(footerHTML !== undefined) ? footerHTML : (footerText !== undefined) ? footerText : ""} 
					${buttons}
				</div>
			</div>
		</div>
	`;

	document.querySelector(`#jc-modal-${rand} .jc-modal-body`).style.maxHeight = `calc(100% - ${(document.querySelector(`#jc-modal-${rand} .jc-modal-header`).clientHeight + document.querySelector(`#jc-modal-${rand} .jc-modal-footer`).clientHeight)}px)`;

	events.forEach(function(data){
		document.getElementById(data.id).addEventListener("click", data.function);
	});

	setTimeout(function(){
		document.querySelector(`#jc-modal-${rand}`).classList.remove("show");
	}, 200);
}

function modalClose(element = null){
	if (element === null) {
		document.querySelectorAll(".jc-modal").forEach(function(element){
			element.classList.add("close");
			setTimeout(function(){
				element.remove();
			}, 200);
		});
	}
	else {
		element.classList.add("close");
		setTimeout(function(){
			element.remove();
		}, 200);
	}
}

function loadingOverlay(action, options = {}){
	let text  = (typeof options.text === "string") ? options.text.stripTags() : "";
	let image = (typeof options.image === "string") ? options.image.stripTags() : "";
	let html  = (typeof options.html === "string") ? options.html : "";
	let delay = (typeof options.delay === "number") ? options.delay : 0;

	let background  = (typeof options.background === "string") ? options.background.stripTags() : "";
	let textStyle   = (typeof options.textStyle === "string") ? options.textStyle.stripTags() : "";
	let imageWidth  = (typeof options.imageWidth === "string") ? options.imageWidth.stripTags() : "";
	let imageHeight = (typeof options.imageHeight === "string") ? options.imageHeight.stripTags() : "";

	setTimeout(function(){
		switch (action.toLowerCase()) {
			case "show": 
				if (document.querySelectorAll(".jc-loading-overlay").length == 0) {
					let tmp = document.createElement("div");

					tmp.classList.add("jc-loading-overlay");
					tmp.classList.add("show");
					document.querySelector("body").appendChild(tmp);
				}

				if (document.querySelectorAll(".jc-loading-overlay-backdrop").length == 0) {
					let tmp = document.createElement("div");
					
					tmp.classList.add("jc-loading-overlay-backdrop");
					if (background != "") {
						tmp.style.background = background;
					}

					document.querySelector(".jc-loading-overlay").appendChild(tmp);
				}

				document.querySelector(".jc-loading-overlay").innerHTML += `
					<div class="jc-loading-overlay-content">
						${(image != "") ? `<div class="jc-loading-overlay-image"><img src="${image}" ${(imageWidth != "") ? `width="${imageWidth}"` : ""} ${(imageHeight != "") ? `height="${imageHeight}"` : ""}></div>` : ""}
						${(text != "") ? `<div class="jc-loading-overlay-text" ${(textStyle != "") ? `style="${textStyle}"` : ""}>${text}</div>` : ""}
						${(html != "") ? `<div class="jc-loading-overlay-html">${html}</div>` : ""}
					</div>
				`;

				setTimeout(function(){
					document.querySelector(".jc-loading-overlay").classList.remove("show");
				}, 200);
				break;
			case "hide":
				if (document.querySelectorAll(".jc-loading-overlay").length > 0) {
					document.querySelector(".jc-loading-overlay").classList.add("close");
					setTimeout(function(){
						if (document.querySelectorAll(".jc-loading-overlay").length > 0) {
							document.querySelector(".jc-loading-overlay").remove();
						}
					}, 200);
				}
				break;
			default:
				throw "Invalid action in 'loadingOverlay'";
		}
	}, delay);
}

function jcLoadData(element, reset = false){
	let url = element.getAttribute("data-jc-url");
	let params = element.getAttribute("data-jc-params");
	let method = element.getAttribute("data-jc-method");
	let disabled = element.getAttribute("data-jc-disabled");
	let value = element.getAttribute("data-jc-value");

	element.querySelectorAll(".jc-loaded-option").forEach(function(child){
		child.remove();
	});
	
	if (reset == false) {
		ajax({
			method: (method !== null) ? method : "GET",
			url: url,
			data: params,
			dataType: "json",
			async: true
		}).then(function(response){			
			if (disabled == "true" && response.data.length == 0) {
				element.disabled = true;
			}
			else{
				element.disabled = false;
			}

			foreach(response.data, function(i, data){
				let option = new Option(data.name, data.value);
				option.classList.add("jc-loaded-option");

				element.options[element.options.length] = option;
			});

			if (value !== null) {
				element.value = value;
				element.removeAttribute("data-jc-value");
			}
		}, function(error){
			let response = error.responseJSON;

			toast({
				type: "error",
				title: "Aviso",
				message: response.message,
				inverse: true
			});
		});
	}
	else{
		if (disabled == "true") {
			element.disabled = true;
		}
		else{
			element.disabled = false;
		}
	}

	if (element.className.search("jc-change-load-data") !== -1) {
		jcChangeLoadData(element, (!empty(value) && reset == false) ? false : true);
	}
}

function jcChangeLoadData(element, reset = false) {
	let name = element.name;
	let value = (!empty(element.value)) ? element.value : ((!empty(element.getAttribute("data-jc-value"))) ? element.getAttribute("data-jc-value") : "");
	let link = element.getAttribute("data-jc-link");
	let links = [];
	
	if (link.search(",") !== -1) {
		links = link.split(",");
	}
	else{
		links.push(link);
	}
	
	links.forEach(function(query){
		let _element = document.querySelector(query);
		let params = _element.getAttribute("data-jc-params");

		if (empty(params)) {
			if (!empty(value)) {
				params = name+"="+value;
			}
		}
		else{
			if (params.search(name) != -1) {
				let regexp = new RegExp(`(\\b${name}=)\\S*\\W?`, "gi");

				params = params.replaceAll(regexp, "");

				if (!empty(value)) {
					params += ((params.length > 0 && params[params.length-1] != "&") ? "&" : "")+name+"="+value;
				}
				else{
					params = (params.length > 0 && params[params.length-1] != "&") ? params : params.substr(0, params.length-1);
				}
			}
			else{
				if (!empty(value)) {
					params += "&"+name+"="+value;
				}
			}
		}
		
		if (!empty(params)) {
			_element.setAttribute("data-jc-params", params);
		}
		jcLoadData(_element, (!empty(value) && reset == false) ? false : true);
	});
}

document.addEventListener("DOMContentLoaded", function(){
	document.querySelectorAll("select.jc-load-data").forEach(function(element){
		let init_load = element.getAttribute("data-jc-init-load");

		if (init_load === null || init_load == "true") {
			jcLoadData(element);
		}
		else{
			element.removeAttribute("data-jc-init-load");
		}
	});

	document.querySelectorAll("select.jc-change-load-data").forEach(function(element){
		element.addEventListener("change", function(){
			jcChangeLoadData(element);
		}, false);
	});

	document.querySelectorAll("input[type='checkbox'].jc-checkbox-link").forEach(function(element){
		element.addEventListener("click", function(){
			let checked = this.checked;
			let link = this.getAttribute("data-link");

			document.querySelectorAll(link).forEach(function(element){
				element.checked = checked;
			});
		});
	});

	document.querySelectorAll("input[data-jc-value], select[data-jc-value], textarea[data-jc-value]").forEach(function(element){
		element.value = element.getAttribute("data-jc-value");
	});

	document.querySelectorAll("input[type='checkbox'][data-jc-checked], input[type='radio'][data-jc-checked]").forEach(function(element){
		if (element.getAttribute("data-jc-checked") === "true") {
			element.checked = true;
		}
		else{
			element.checked = false;
		}
	});

	document.querySelectorAll("[data-jc-disabled]").forEach(function(element){
		if (element.getAttribute("data-jc-disabled") === "true") {
			element.disabled = true;
		}
		else{
			element.disabled = false;
		}
	});
}, false);
