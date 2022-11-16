back:
	cd ./backend && uvicorn main:app --reload
front:
	cd ./frontend && npm start
qs:
	cd ./query_service && npm run dev
ventas:
	cd ./sell_service && npm run dev
compras:
	cd ./buy_service && npm run dev