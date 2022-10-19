from xmlrpc.client import ResponseError
import requests as _requests
import json

async def queryBookAPI(params: str=""):
    PATH = "https://www.googleapis.com/books/v1/volumes?q="
    try:
        params = [f"{k}:{v}" for k, v in params.items()]
        params = "&".join(params)
        res = _requests.get(f"{PATH}{params}")
        
        print(vars(res).keys())
        print(type(json.loads(res._content)))

        if res.status_code != 200:
            raise ResponseError(f"{res.status_code}")
        
        return {
            "success": True,
            "response": json.loads(res._content)
        }
    except Exception as e:
        return {
            "success": False,
            "error": {
                "type": str(type(e.orig)),
                "code": e.code
            }
        }

if __name__ == "__main__":
    response = queryBookAPI({
        "isbn": "9780262033848"
    })
    print(response["success"])
    print(json.dumps(response["response"], indent=2))