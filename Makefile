back:
	cd ./backend && uvicorn main:app --reload
front:
	cd ./frontend && npm start