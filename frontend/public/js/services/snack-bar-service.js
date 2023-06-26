class SnackBarService {


	static success(msg){
		SnackBarService.create(msg, "success");
	}

	static error(msg){
		SnackBarService.create(msg, "error");
	}

	static create(msg, type){
		var x = document.getElementById("snackbar");
		x.innerHTML = msg;
	    x.className = type;
	    setTimeout(()=> x.className = x.className.replace(type, ""), 3000);
	}
}

