back:
	cd ./backend && uvicorn main:app --reload
front:
	cd ./frontend && npm start
qs:
	cd ./query_service & npm run dev