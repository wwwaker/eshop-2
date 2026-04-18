-- 清理重复的分类数据
DELETE c1 FROM categories c1
INNER JOIN categories c2 
WHERE c1.id > c2.id AND c1.name = c2.name;

-- 清理重复的商品数据
DELETE p1 FROM products p1
INNER JOIN products p2 
WHERE p1.id > p2.id AND p1.name = p2.name;

-- 清理无效的商品（分类ID不存在的商品）
DELETE FROM products WHERE category_id NOT IN (SELECT id FROM categories);

-- 重置分类表的自增ID
-- SET @count = 0;
-- UPDATE categories SET id = @count:= @count + 1 ORDER BY id;
-- ALTER TABLE categories AUTO_INCREMENT = 1;

-- 重置商品表的自增ID
SET @count = 0;
UPDATE products SET id = @count:= @count + 1 ORDER BY id;
ALTER TABLE products AUTO_INCREMENT = 1;

-- 验证结果
SELECT 'Categories count:', COUNT(*) FROM categories;
SELECT 'Products count:', COUNT(*) FROM products;