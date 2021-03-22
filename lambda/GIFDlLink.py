import json
import base64
import time, urllib
import urllib3
import boto3

http = urllib3.PoolManager() 

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_name = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
 
    presignedURL = s3.generate_presigned_url("get_object", Params = {"Bucket": bucket_name, "Key": file_name}, ExpiresIn=86400)
    URL = f"http://s3.amazonaws.com/{bucket_name}/{file_name}"
    
    webhook_url = "https://apbe.webhook.office.com/webhookb2/f6f71d7f-30ca-40cf-b05f-c1712d3a18f5@33d8cf3c-2f14-48c0-9ad6-5d2825533673/IncomingWebhook/b8dc37c11589469d9ad0e658732524ca/b4346aee-3f50-47d0-87cc-c21110180ef4"    
    msg = {
        "text": "Klik hier om je GIF te downloaden: " + URL
    }
    encoded_msg = json.dumps(msg).encode('utf-8')
    resp = http.request('POST',webhook_url, body=encoded_msg)
    # print({
    #     "message": URL, 
    #     "status_code": resp.status, 
    #     "response": resp.data
    # })
