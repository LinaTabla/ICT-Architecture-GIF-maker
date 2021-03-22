async function addPhoto() {
  let fileList = document.getElementById("custom-file-input").files;

  if (!fileList.length) {
    const alert = document.getElementById("alert");
    const text = document.createTextNode(
      "Please choose a file to upload first."
    );
    if (alert.style.display === "none") {
      alert.style.display = "block";
    } else {
      alert.style.display = "none";
    }
    return alert.appendChild(text);
  } else {
    let button = document.getElementById("button");
    button.style.display = "none";
    let loadGif = document.getElementById("loadGif");
    loadGif.style.display = "block";

    const email = document.getElementById("email").value;
    const output = document.getElementById("output");
    console.log(fileList);

    const baseUrl = `https://ju31c1en6e.execute-api.us-east-1.amazonaws.com/v1/upload?email=${email}`;
    const prefixUrl = `https://ju31c1en6e.execute-api.us-east-1.amazonaws.com/v1/upload?email=trigger`;

    // function to upload a file with file as parameter
    async function uploadViaPresignedPost(file, url) {
      // request pre-signed upload url
      let response = await fetch(url);
      let json = await response.json();

      // build a form for the request body
      let form = new FormData();
      form.append("Content-Type", file.type);
      Object.keys(json.data.fields).forEach((key) =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", file);

      // upload image(s): pre-signed url with file in body
      response = await fetch(json.data.url, {
        method: "POST",
        body: form,
      });

      if (!response.ok) console.log("Failed to upload via presigned POST");
      else console.log(`File uploaded via presigned POST with key: ${json.id}`);
    }

    // loop through the files to upload each file with the upload function
    for (const file of fileList) {
      await uploadViaPresignedPost(file, baseUrl);
    }

    // upload an empty file with 'trigger' as prefix to trigger the create-gif-lambda
    const file = fileList[0];
    await uploadViaPresignedPost(file, prefixUrl);

    // Show succes to client
    loadGif.style.display = "none";
    button.style.display = "block";
    const text = document.createTextNode("Files oploaded succesfully!");
    if (output.style.display === "none") {
      output.style.display = "block";
    } else {
      output.style.display = "none";
    }
    output.appendChild(text);
  }
}
