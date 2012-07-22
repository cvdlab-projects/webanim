/**
 *	Function that send a request for a video on the server
 *	and handle the response showing the results of the search
 */


!(function(){
	$('#searchButton').on('click',
			function(e){ 
			var q = $('#searchBox').val();
			$.ajax({
				type: "GET",
				dataType: "text",
				url: ("./searchVideo/"),
				data: "q="+q+"* OR searchTag="+q+"* OR videoDescription="+q+"* OR videoName="+q+"*",
				error: function(data) {
						console.log(data);
						if(data.status===404)
							alert("La ricerca effettuata non ha prodotto risultati");
						if(data.status===400)
							alert('Bad request, fill all data fields');
						if(data.status===0)
							alert("Errore sconosciuto");
					},
				success: function(data) {
					$('#results').children().remove();
					$('#videoPlayer').children().remove();
					var resp = '<ul id="resultList">';
					var result = JSON.parse(data);
					result.forEach( function(item){
						var vprev = (item.videoPreview!==undefined)? item.videoPreview:'./media/image/videoPreviewDefault.png';
						resp += '<li class="resultItem">' + 
								'<ul class="resultVideo">'+ 
									'<li class="resultVideoPreview">'+
										'<img class="videoPreview" src='+ vprev +' style="width:20%; height:20%" / > '+
									'</li>'+
									'<li class="resultVideoInfo">'+
										'<div class="Name">Name: ' + item.videoName.substring(0,item.videoName.lastIndexOf('_')) + '</div>' +
										'<div class="Tag">Tag: ' + item.searchTag + '</div>' +
										'<div class="Description">Description: ' + item.videoDescription + '</div>' +
										'<button onClick="window.location=\'' + item.videoPath.replace(/\/media\/video\//, "/downloadVideo/") + '\'">Download Video</button>' +
									'</li>' +
								 '</ul>' +
							'</li>';
					});
					resp += '</ul>';
					$("#results").append(resp);
					
					$('.resultVideoPreview').on('click', function(e){
						$('#videoPlayer').children().remove();
						var link = $(this).parent().find('button').attr('onClick');
						link = link.substring(link.indexOf('\'') + 1, link.lastIndexOf('\''));
						link = link.replace(/\/downloadVideo\//,'/media/video/');
						var vPlayer = '<video controls="controls">' + 
									  '<source src="'+link+'" type="video/ogg" / >' +
										  'Your browser doesn\'t support video tag' +
									  '</video>';
						$('#videoPlayer').append(vPlayer);					
					});
				}
			});
		});
	}());

