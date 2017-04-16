<script type="text/javascript"  src="js/jquery/jquery-2.1.3.min.js"></script>

  </script><script language="Javascript">



$(document).on('click', '#emoticons a', function() {    


var smiley = $(this).attr('title');

    var caretPos = caretPos();

    var strBegin = $('#description').val().substring(0, caretPos);
    var strEnd   = $('#description').val().substring(caretPos);

    $('#description').val( strBegin + " " + smiley + " " + strEnd);




function caretPos()
{
    var el = document.getElementById("description");
    var pos = 0;
    // IE Support
    if (document.selection) 
    {
        el.focus ();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart ('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    // Firefox support
    else if (el.selectionStart || el.selectionStart == '0')
        pos = el.selectionStart;

    return pos;

}


});


</script>


<input type="text" id="description" name="description">

<div id="emoticons">
    <a href="#" title=":)"><img alt=":)" border="0" src="http://markitup.jaysalvat.com/examples/markitup/sets/bbcode/images/emoticon-happy.png" /></a>
    <a href="#" title=":("><img alt=":(" border="0" src="http://markitup.jaysalvat.com/examples/markitup/sets/bbcode/images/emoticon-unhappy.png" /></a>
    <a href="#" title=":o"><img alt=":o" border="0" src="http://markitup.jaysalvat.com/examples/markitup/sets/bbcode/images/emoticon-surprised.png" /></a>
</div>