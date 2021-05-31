function get_news_test_js() {
$('#get_more_news').on('submit', function (e) {
                    e.preventDefault()
                    var formData = $(this).serialize()
                    $.ajax({
                        url:'/more_news',
                        type:'get',
                        data:formData,
                        dataType:'html',
                        success:function (data) {
                            // console.log(data);
                            parser=new DOMParser();
                            new_html=parser.parseFromString(data, "text/html");
                            document.getElementById("news").innerHTML = new_html.getElementById('news').innerHTML;
                        }
                    })
                })
}