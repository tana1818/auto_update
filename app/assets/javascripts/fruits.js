$(function(){
  function buildHTML(fruit){ //通信が成功するとdoneメソッドの引数にデータが入るようになっているため、これを利用してHTMLを組み立てる
    var html = `<tr class = "item ui-sortable-handle">
                  <td>
                    ${fruit.name}
                  </td>
                  <td>
                    <a href = /fruits/${fruit.id}>Show</a>
                  </td>
                  <td>
                    <a href = /fruits/${fruit.id}/edit>Edit</a>
                  </td>
                  <td>
                  <a data-confirm = "Are you sure?", rel = "nofollow", href = /fruits/${fruit.id}, data-method = "DELETE">Destroy</a>
                  </td>
                </tr>`
    return html;
  }
  $('#new_fruit').on('submit', function(e){ //'#new_fruit'の'submit'が押された時に発火
    e.preventDefault(); //これを書いてるせいで'submit'を押した際に要素にdisabledが付与される→最後の.alwasが書いてある行を足すことでそのdisabled要素を削除してる
    var formData = new FormData(this); //FormDataオブジェクトの引数はthisとなってる。イベントで設定したfunction内でthisを利用した場合はイベントが発生したDOM要素を指す。今回であればnew_commentというIDがついたフォームの情報を取得している
    $.ajax({
      url: "/fruits/", //ここはアクションのURLなのでrails routesで確認
      type: "POST", //ここはアクション名
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){ //非同期通信の結果として返ってくるデータは、done(function(data) { 処理 })の関数の引数で受け取る
      var html = buildHTML(data);
      $('.fruit_item').append(html) //htmlに追加
      $('.b').val('') //なんかエラー出るなーと思ったらvarと書き間違えていた（ここでは'submit'を押した後テキストボックスに空の要素を付与してる）
    })
    .fail(function(){ //エラーが置きた際
      alert('投稿できませんでした')
    })
    .always(function(){ //この記述を書いてないと連続で投稿できない
      $(".c").removeAttr("disabled")
    })
  })
});