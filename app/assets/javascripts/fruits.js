$(function(){
  //非同期通信
  function buildHTML(fruit){ //通信が成功するとdoneメソッドの引数にデータが入るようになっているため、これを利用してHTMLを組み立てる
    //５行目にdata-id = ${fruit.id}を追加
    var html = `<tr class = "item ui-sortable-handle" data-id = ${fruit.id}>
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
      // $('.b').val('') //なんかエラー出るなーと思ったらvarと書き間違えていた（ここでは'submit'を押した後テキストボックスに空の要素を付与してる）
      $('.new_fruit')[0].reset() //初期値があれば初期値にリセットされる
    })
    .fail(function(){ //エラーが置きた際
      alert('投稿できませんでした')
    });
    
    // .always(function(){ //この記述を書いてないと連続で投稿できない
    //   $(".c").removeAttr("disabled")
    // })
    return false;
    //要素の効果を無効化する、ちょっとわかんないけどとりま親要素のクリックをなかった」ことにするっぽいw
    //上記のコメント化記述は'disabled'を消しにいってる
    //こっちの方が記述量が少なくて良い
  })


  //自動更新
  if (location.pathname.match()){ //もし現在のURLパスがindexアクションだったら（http://localhost:3000/fruitsもしくはhttp://localhost:3000）
    setInterval(update, 5000);//5000ミリ秒ごとにupdateという関数を実行する
  }
  
  function update(){
    if($('.item')[0]){ //もし'.item'というクラスがあったら
      var fruit_id = $('.item:last').data('id'); //一番最後にある'.item'クラスの'id'というデータ属性を取得し、'fruit_id'という変数に代入
    }
    else { //ない場合は
      var fruit_id = 0 //0を代入（これは何も投稿されてなかった場合NULLではなく０を入れてあげる処理）
    }
    $.ajax({
      url: location.href, //urlは現在のページを指定
      type: 'GET', //アクション名指定（データを表示させる）
      data: { id: fruit_id }, //rails に引き渡すデータ
      dataType: 'json'
    })
    .done(function(data){
      if (data.length){ //もしdataに値があったら
        $.each(data, function(i, data){ //'data'を'data'に代入してeachで回す
          var html = buildHTML(data);
          $('.fruit_item').append(html);
        })
      }
    })
    .fail(function(){ //そんなにこの記述はいらない気がするけど、異常系のエラー（途中で通信が中断されたり）が起きた時用
      alert('自動更新に失敗しました')
    });
  }
});