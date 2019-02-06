function updateAccessory(id) {
	$.ajax({
		url: '/accessories/' + id,
		type: 'POST',
		data: $('#update-accessories').serialize(),
		success: function(result){
			window.location.replace("/accessories");
		}
	})
};
		
