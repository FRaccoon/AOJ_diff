$(document).ready(function() {
  (function() {
    var params = window.location.search.substring(1).split('&');
    for(var i = 0; i < params.length; i++) {
      var par = params[i].split('=');
      if(par[0]=='yourID')$('input[name="yourID"]').val(par[1]);
      else if(par[0]=='rivalID')$('input[name="rivalID"]').val(par[1]);
    }
  })();
  
  var load = function(id) {
    var res;
    $.ajax({
      url: 'http://judge.u-aizu.ac.jp/onlinejudge/webservice/solved_record',
      data: {user_id: id},
      async: false,
      dataType: 'xml',
      type: 'get',
      success: function(data, dataType) {
        res=data;
      },
    });
    return res;
  }
  
  var list = function(xml) {
      var res = [];
      $(xml).find('solved').each(function() {
        res.push( parseInt($(this).find('problem_id').text(), 10) );
      });
      return res;
  }
  
  var diff = function(a, b) {
    var res = [[], [], []];
    var j=0;
    for(var i=0;i<a.length;i++) {
      while(a[i]>b[j] && j<b.length) {
        res[1].push(b[j]);
        j++;
      }
      if(j<b.length && a[i]==b[j]) {
        res[2].push(a[i]);
        j++;
      } else res[0].push(a[i]);
    }
    return res;
  }
  
  $('input[name="submit"]').on('click', function() {
    var y = $('input[name="yourID"]').val();
    var r = $('input[name="rivalID"]').val();
    //console.log(y);
    if(y=='' || r=='')return ;
    $('#result').empty();
    y = load(y);
    r = load(r);
    //console.log(y);
    y = list(y);
    r = list(r);
    //console.log(y);
    (function(c, d) {
      for(var i=0;i<c.length;i++) {
        var a = $('<p>'+c[i]+'解いた問題 : <br>'+'</p>');
        for(var j=0;j<d[i].length;j++) {
          var p = ('000'+d[i][j]).slice(-4);
          a.append( $('<a>'+p+'</a>').attr('href', 'http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id='+p).attr('target', '_blank') ).append($('<span>&nbsp;&nbsp;</span>'));
        }
        $('#result').append(a);
      }
    })(['あなたのみが', '相手のみが', '両方が'], diff(y, r));
  });
  
});