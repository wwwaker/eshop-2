-- 插入商品分类
INSERT IGNORE INTO categories (name, description, sort_order) VALUES
('运动户外', '运动装备、户外用品', 6),
('美妆护肤', '化妆品、护肤品', 7),
('玩具乐器', '儿童玩具、乐器', 8);

-- 插入商品数据
INSERT IGNORE INTO products (name, description, price, stock, category_id, image_url, status) VALUES
('运动跑鞋', '轻便透气，减震防滑', 599.00, 200, 6, '/images/running-shoes.jpg', 'ON_SALE'),
('瑜伽垫', '环保材质，防滑耐磨', 129.00, 300, 6, '/images/yoga-mat.jpg', 'ON_SALE'),
('健身哑铃', '可调节重量，家用健身', 299.00, 150, 6, '/images/dumbbell.jpg', 'ON_SALE'),
('户外帐篷', '防风防雨，多人使用', 899.00, 100, 6, '/images/tent.jpg', 'ON_SALE'),
('运动水壶', '大容量，保温保冷', 89.00, 400, 6, '/images/water-bottle.jpg', 'ON_SALE'),
('面部精华', '深层滋养，抗老紧致', 399.00, 150, 7, '/images/serum.jpg', 'ON_SALE'),
('防晒霜', 'SPF50+，防水防汗', 129.00, 300, 7, '/images/sunscreen.jpg', 'ON_SALE'),
('口红', '持久显色，滋润保湿', 199.00, 200, 7, '/images/lipstick.jpg', 'ON_SALE'),
('面膜', '补水保湿，提亮肤色', 99.00, 400, 7, '/images/mask.jpg', 'ON_SALE'),
('洁面乳', '温和清洁，不紧绷', 89.00, 350, 7, '/images/cleanser.jpg', 'ON_SALE'),
('乐高积木', '益智拼装，开发智力', 299.00, 150, 8, '/images/lego.jpg', 'ON_SALE'),
('遥控汽车', '充电遥控，高速行驶', 199.00, 200, 8, '/images/remote-car.jpg', 'ON_SALE'),
('电子琴', '入门级，带教学功能', 499.00, 100, 8, '/images/keyboard.jpg', 'ON_SALE'),
('毛绒玩具', '柔软舒适，可爱造型', 89.00, 300, 8, '/images/plush-toy.jpg', 'ON_SALE'),
('益智拼图', '开发逻辑思维', 49.00, 400, 8, '/images/puzzle.jpg', 'ON_SALE');