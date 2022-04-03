document.addEventListener('DOMContentLoaded', function () {
    var JSZip = require("jszip");

    document.querySelectorAll("button").forEach((el) => {
        el.onclick = () => {
            parent.postMessage({ pluginMessage: { type: el.id } }, '*')
        };
    })

    window.onmessage = async (event) => {
        if (!event.data.pluginMessage) return
        switch (event.data.pluginMessage.type) {
            case "exportFiles":
                exportFiles(event.data.pluginMessage);
                break;
            case "print":
                print(event.data.pluginMessage.text);
                break;
        }
    };

    function print(s: string) {
        let textArea = document.querySelector("#output") as HTMLTextAreaElement;
        textArea.style.display = "block";
        textArea.value = s;
    }

    function typedArrayToBuffer(array) {
        return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
    }

    async function exportFiles(message) {
        let {lessons, thumbnails, rootName} = message
        let zip = new JSZip();
        let files = lessons.concat(thumbnails);

        for (let file of files) {
            const { path, bytes } = file
            const cleanBytes = typedArrayToBuffer(bytes)
            let blob = new Blob([ cleanBytes ], { type: 'application/octet-stream' })
            zip.file(path, blob, {base64: true});
        }

        const content = await zip.generateAsync({ type: 'blob' })
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.className = 'button button--primary';
        link.href = blobURL;
        link.download = `${rootName.replace("COURSE-", "")}.zip`
        link.click()
        // link.setAttribute('download', name + '.zip');
    }
});
