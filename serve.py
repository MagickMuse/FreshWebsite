#!/usr/bin/env python3
import http.server
import os

PORT = 3000
DIR  = "/Users/avelynn/Documents/GitHub/FreshWebsite"

os.chdir(DIR)

handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(("", PORT), handler) as httpd:
    print(f"Serving {DIR} on http://localhost:{PORT}")
    httpd.serve_forever()
