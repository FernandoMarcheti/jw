class DateHelper {
	
	static textoParaData(texto){
                return texto ? new Date(texto.split('/')[2], texto.split('/')[1]-1, 
					texto.split('/')[0]) : "";
	}

	static setDatePicker(data){
 		if(data){
 			if(typeof new Date() === typeof data){
 				return data;
 			} else {
 				return data.convertToDate();
 			}
 		}
 	}
}
