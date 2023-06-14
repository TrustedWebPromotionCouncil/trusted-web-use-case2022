#!/usr/bin/env python
# -*- coding: utf-8 -*-

import asyncio
import base64
import json
import os
import re
import subprocess
import time

from hmserver.apps.common.logger import logger_obj
from pyramid.view import view_config

log_file_obj = None

@view_config(route_name="activate_unid", xhr=True, renderer="jsonp")
def activate_unid(request):
    logger_obj.log("Enter active_server...")

    sock_address = os.environ["HOME"] + ".unid/run/unid.sock"
    pgrep = "pgrep unid-agent.i686"
    logger_obj.log("cmd: " + pgrep)
    process = subprocess.run(pgrep.split(), capture_output=True, text=True).stdout
    logger_obj.log("cmd_result: " + process)
    if (os.path.exists(sock_address) is False) or not process:
        logger_obj.log("activate unid-agent...")
        cmd = "nohup {0}/script/unid-agent.i686 &".format(os.environ["HOME"])
        logger_obj.log("cmd: " + cmd)
        # Create a new log file for unid-agent each time
        global log_file_obj
        log_file_obj = open("{}/unid_log.txt".format(os.environ["HOME"]), "w", encoding="UTF-8")
        # Don't wait for child process to exit
        popen_obj = subprocess.Popen(cmd, stdout=log_file_obj, stderr=log_file_obj, shell=True)
        return {"status": "SUCCEEDED"}
    else:
        logger_obj.log("unid-agent is already activated...")
        return {"status": "SUCCEEDED"}


@view_config(route_name="kill_unid", xhr=True, renderer="jsonp")
def kill_unid(request):
    global log_file_obj
    if log_file_obj is not None:
        log_file_obj.close()
        log_file_obj = None
        # Export unid-agent log to webapplog.log
        with open("{}/unid_log.txt".format(os.environ["HOME"]), "r", encoding="UTF-8") as f:
            logger_obj.log("unid-agent log start ...")
            for line in f:
                logger_obj.log(line)
            logger_obj.log("unid-agent log end ...")

    MAX_LOOP_CYCLE = 20
    WAIT_SECONDS_PER_CYCLE = 0.1
    cmd = "pkill -9 unid-agent.i686"
    logger_obj.log("cmd: " + cmd)
    subprocess.run(cmd.split())
    pgrep = "pgrep unid-agent.i686"

    # Immediately after the kill, pgrep may be able to get the PID.
    # Wait until it is no longer possible to get the PID.
    for n in range(MAX_LOOP_CYCLE):
        logger_obj.log("Kill completion check: {}".format(n + 1))
        logger_obj.log("cmd: " + pgrep)
        process = subprocess.run(pgrep.split(), capture_output=True, text=True).stdout
        logger_obj.log("cmd_result: " + process)
        if not process:
            return {"status": "SUCCEEDED"}
        elif n < MAX_LOOP_CYCLE - 1:
            time.sleep(WAIT_SECONDS_PER_CYCLE)
            continue
        else:
            return {"status": "FAILED"}


async def get_containers(method, contents):
    MAX_LOOP_CYCLE = 20
    WAIT_SECONDS_PER_CYCLE = 0.1

    # Path to the socket file of unid-agent
    sock_address = os.environ["HOME"] + ".unid/run/unid.sock"
    logger_obj.log("socket address: " + sock_address)

    # Wait for the unix socket file to be make
    for n in range(MAX_LOOP_CYCLE):
        logger_obj.log(str(n) + "times...")
        if os.path.exists(sock_address) is True:
            break
        elif n < MAX_LOOP_CYCLE - 1:
            time.sleep(WAIT_SECONDS_PER_CYCLE)
            continue
        else:
            logger_obj.log("Timeout: unix socket file was not made!")
            return []

    reader, writer = await asyncio.open_unix_connection(sock_address)

    # Calculate Content-Length
    content_length = len(contents.encode("utf-8"))

    # Request header
    query = (
        # (Request method) (Request URI) (HTTP version)\r\n
        f"{method} HTTP/1.1\r\n"
        # (Header)\r\n
        f"Host: localhost\r\n"
        f"User-Agent: scan-to-did/1.0\r\n"
        f"Accept: application/json\r\n"
        f"Content-Type: application/json\r\n"
        f"Content-Length: {content_length}\r\n"
        # (Blank line)
        f"\r\n"
        # Message body
        f"{contents}"
    )

    # Send a request message
    writer.write(query.encode("utf-8"))
    await writer.drain()
    writer.write_eof()

    # Receive a response message
    logger_obj.log("Response header ->")
    headers = True
    is_body = True
    while headers:
        try:
            # The time that unid-agent waits for a response from UNiD HUB is 15 seconds
            line = await asyncio.wait_for(reader.readline(), timeout=30)
            line_str = line.decode("utf-8")
            logger_obj.log(line_str)
            # Skip to message body
            if line == b"\r\n":
                headers = False
            elif not line:
                break
            # Get content-length
            elif "content-length" in line_str:
                result_re = re.search("[0-9]{1,}", line_str)
                if result_re is not None:
                    length = result_re.group()
                    if length == "0":
                        logger_obj.log("content-length is zero!")
                        is_body = False
            elif "200 OK" in line_str:
                logger_obj.log("Detect: " + line_str)
            # Message body will be received in this case
            elif "400 Bad Request" in line_str:
                logger_obj.log("Detect: " + line_str)
            # Message body will not be received in this case
            elif "500 Internal Server Error" in line_str:
                logger_obj.log("Detect: " + line_str)
        except Exception as e:
            logger_obj.log(e.__class__.__name__ + ": " + str(e))
            break
    containers = []
    if not headers and is_body:
        # Get message body
        try:
            data = await asyncio.wait_for(reader.readline(), timeout=3)
            data_str = data.decode("utf-8")
            logger_obj.log("Response body -> " + data_str)
            containers = json.loads(data_str)
        except Exception as e:
            logger_obj.log(e.__class__.__name__ + ": " + str(e))
            containers = []
    writer.close()
    await writer.wait_closed()
    return containers


@view_config(route_name="POST_CreateDID", xhr=True, renderer="jsonp")
def POST_CreateDID(request):
    logger_obj.log("Enter post_createdid...")
    did = ""
    file_path = "/application/app/bd8a8fef-efe7-487a-a0c2-ffffffffff00/appstorage/normal/" + "did_document"
    if os.path.isfile(file_path):
        logger_obj.log("Open did_document file.")
        f = open(file_path)
        s = f.read()
        f.close()
        try:
            did_document = json.loads(s)
        except Exception as e:
            logger_obj.log(e.__class__.__name__ + ": " + str(e))
        did = did_document["id"]
        logger_obj.log("Read DID=" + did)

    if not did:
        logger_obj.log("Call EDGE API.")

        post_data = {}
        response_data = asyncio.run(get_containers("POST /identifiers", json.dumps(post_data)))
        if response_data != []:
            identifiers_json = response_data
            did_document = identifiers_json["didDocument"]
            f = open(file_path, "w", encoding="UTF-8")
            f.write(json.dumps(did_document))
            f.close()
            did = did_document["id"]
            logger_obj.log("Got DID=" + did)
            return {"status": "SUCCEEDED", "did": did}
        else:
            return {"status": "FAILED", "did": ""}
    else:
        return {"status": "SUCCEEDED", "did": did}


@view_config(route_name="POST_Transfer", xhr=True, renderer="jsonp")
def POST_Transfer(request):
    logger_obj.log("Enter post_transfer...")

    setdata = request.json
    target_did = setdata["did"]
    user_id = setdata["id"]
    mfp_serial = setdata["serial"]
    # If no value is set in TopAccess, the location element is set to None.
    location = setdata["location"]
    if location is None:
        location = ""
    file_name = setdata["file_name"]

    logger_obj.log("target did: " + target_did)
    logger_obj.log("user id: " + user_id + "serial: " + mfp_serial)
    logger_obj.log("location: " + location + "file: " + file_name)

    files = os.listdir("./")
    scan_files = [f for f in files if file_name in f]
    logger_obj.log(scan_files)
    if len(scan_files) == 0:
        # Scanned files have not been created.
        return {"status": "FAILED", "response": None}
    else:
        # One file should be created because this system uses only Multi-PDF formats.
        scan_file = scan_files[0]

    message = {}
    messages = []
    for scan_file in scan_files:
        # Read the binary data of the scanned file
        with open(scan_file, "rb") as f:
            img_bytes = f.read()

        # Encode the binary data to base64
        img_base64 = base64.b64encode(img_bytes)
        # Convert the data type from binary to string
        img_decode = img_base64.decode("utf-8")

        # Make request json object
        message["filename"] = scan_file
        message["base64_data"] = img_decode
        message["media_type"] = "application/pdf"
        messages.append(message.copy())
        message.clear()

    destinations = []
    destinations.append(target_did)

    metadata = {}
    metadata["user"] = user_id
    metadata["mfp_serial"] = mfp_serial
    metadata["location"] = location

    post_data = {}
    post_data["destinations"] = destinations
    post_data["messages"] = messages
    post_data["metadata"] = metadata

    response_data = asyncio.run(get_containers("POST /transfer", json.dumps(post_data)))
    if response_data != []:
        for result in response_data["results"]:
            logger_obj.log("success: ", str(result))
            if result["success"] is True:
                return {"status": "SUCCEEDED", "response": None}
        
        return {"status": "FAILED", "response": response_data}
    else:
        return {"status": "FAILED", "response": None}
