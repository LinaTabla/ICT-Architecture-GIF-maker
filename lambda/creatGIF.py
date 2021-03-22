#import time, urllib
import json
import boto3
import requests
import base64


"""Code snippet for copying the objects from AWS source S3 bucket to target S3 bucket as soon as objects uploaded on source S3 bucket
@author: Prabhakar G
"""

s3 = boto3.client('s3')

def lambda_handler(event, context):
    
    source_bucket = 'images-group-8'
    all_objects = s3.list_objects_v2(Bucket=source_bucket)
    prefix = all_objects['Contents'][0]['Key'].split('/')[0]
    uuid = all_objects['Contents'][0]['Key'].split('/')[1]
    objects_by_prefix = s3.list_objects_v2(Bucket=source_bucket, Prefix=prefix)
    keys = objects_by_prefix['Contents']
    
    # get all images by url
    image_list = []
    for k in range(len(keys)):
        image_list.append(s3.generate_presigned_url('get_object', Params={'Bucket': source_bucket, 'Key': keys[k]['Key']}, ExpiresIn=10000))
    
    
    # prepare data for post request
    post_url = 'https://msw31oj97f.execute-api.eu-west-1.amazonaws.com/Prod/generate/gif'
    payload = {
        "inputImageUrls": image_list,
        "outputImageUrl": f"http://s3.amazonaws.com/gifs-group-8/{uuid}.gif"
    }
    data = json.dumps(payload)

    headers = {
        'x-api-key': 'SIdHi3lzwma61h4GeBGR96ZD4rpsa3mb6iKVlMG7',
        'Content-Type': 'application/json',
    }
    
    # make the post request
    response = requests.request("POST", post_url, headers=headers, data=data)
    print('Response: ', response.text)

    # delete all images from the images bucket 
    all_objects = s3.list_objects_v2(Bucket=source_bucket)['Contents']
    for obj in range(len(all_objects)):
        key = all_objects[obj]['Key']
        s3.delete_object(Bucket=source_bucket, Key=key)
