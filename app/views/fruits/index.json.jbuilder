json.array! @new_fruit.each do |fruit|
  json.name fruit.name
  json.id fruit.id # 配列かつjson形式で@new_fruitを返す
end