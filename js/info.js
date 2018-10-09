$(function()
{
	 $("#infoBox")
	.css(
	{
	   "background":"rgba(255,255,255,0.5)"
	})
	.dialog({ autoOpen: true,
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 }
	});

	 $("#infoButton")
       .text("") // set text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9",
	  "position":"absolute", "top":"4px", "left":"4px"
	})
});
