import gulp from "gulp";
import { JSDOM } from "jsdom";
import through2 from "through2";

export function log() {
  let fileErrors = {};

  gulp.task("log", async () => {
    const stream = gulp
      .src("_input/**/*.{html,htm}")
      // check for DOCTYPE and missing <html>
      .pipe(
        through2.obj(function (file, enc, cb) {
          const missingHTMLMsg = "Missing <html lang='en'>";
          const missingDoctypeMsg = "Missing <!DOCTYPE html>";
  
          if (file.isBuffer()) {
            let content = file.contents.toString();
            let dom = new JSDOM(content, { includeNodeLocations: true });
            let document = dom.window.document;
  
            if (!document.doctype || "html" !== document.doctype.name.toLowerCase()) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(missingDoctypeMsg);
            }
  
            let html = document.querySelector("html");
            if (!html || "en" !== html.getAttribute("lang")) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(missingHTMLMsg);
            }
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )
      
      // check for missing <header class="header"> or #content-wrapper
      .pipe(
        through2.obj(function (file, enc, cb) {
          const missingHeaderMsg = "Missing <header class='header'></div>";
          const missingContentWrapperMsg = "Missing '#content-wrapper'";
      
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
      
            let headerElement = doc.querySelector("header.header");
            let divElement = doc.querySelector("div#content-wrapper");
      
            if (!headerElement) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(missingHeaderMsg);
            }
      
            if (!divElement) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(missingContentWrapperMsg);
            }
      
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )
      
      // check for youtube or panopto iframes that exist outside of .media-container
      .pipe(
        through2.obj(function (file, enc, cb) {
          const filesWithInvalidIframesMsg = "Invalid iframes detected (not contained within '.media-container')";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            let iframes = doc.querySelectorAll("iframe");
            let invalidIframes = Array.from(iframes).filter((iframe) => {
              let src = iframe.getAttribute("src");
              if (src && (src.includes("https://www.youtube.com") || src.includes("https://pima-cc.hosted.panopto.com"))) {
                let parent = iframe.parentElement;
                while (parent != null) {
                  if (parent.tagName.toLowerCase() === "div" && parent.getAttribute("class") === "media-object") {
                    return false;
                  }
                  parent = parent.parentElement;
                }
                return true;
              }
              return false;
            });
  
            if (invalidIframes.length > 0) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(filesWithInvalidIframesMsg);
            }
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // Check for iframes that include title="youtube video player"
      .pipe(
        through2.obj(function (file, _, cb) {
          const invalidYtPanoptoTitleMsg = "Invalid iframes detected (incorrect title attribute)";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            // Check if the document contains an <iframe> with title "YouTube video player"
            let iframeElement = Array.from(doc.querySelectorAll("iframe")).find((iframe) => iframe.title.includes("YouTube video player"));
  
            // If such an iframe is present, add the file path to the fileErrors object with appropriate message
            if (iframeElement) {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(invalidYtPanoptoTitleMsg);
            }
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // Check for h5p resizer
      .pipe(
        through2.obj(function (file, enc, cb) {
          const missingH5pResizerMsg = "Invalid H5P activity (missing H5P resizer js)";
  
          if (file.isBuffer()) {
            let htmlString = file.contents.toString();
            let dom = new JSDOM(htmlString);
            let document = dom.window.document;
            let iframes = Array.from(document.querySelectorAll("iframe"));
            let h5pIframes = iframes.filter((iframe) => iframe.getAttribute("src").startsWith("https://pima.h5p.com"));
            if (h5pIframes.length > 0) {
              let script = document.querySelector('head > script[src="https://pima.h5p.com/js/h5p-resizer.js"][charset="UTF-8"][defer]');
              if (!script) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(missingH5pResizerMsg);
              }
            }
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )
  
      // check for .content-body
      // log if any are nested within another .content-body
      // log if any are not inside #content-wrapper, #second-column, or #third-column
      .pipe(
        through2.obj(function (file, _, cb) {
          const nestedContentBodiesMsg = "An invalid '.content-body' (nested within another '.content-body')";
          const invalidContentBodyMsg = "A 'content-body' is not inside #content-wrapper, #second-column, or #third-column";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            let contentBodies = doc.querySelectorAll(".content-body");
            Array.from(contentBodies).forEach((contentBody) => {
              // Check for nested "content-body" divs not only in direct children but in any descendant
              let nestedContentBodies = contentBody.querySelectorAll(".content-body");
              if (nestedContentBodies.length > 0) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(nestedContentBodiesMsg);
              }
  
              // Check if content-body is not inside #content-wrapper, #second-column, or #third-column
              let parent = contentBody.parentElement;
              let validParentFound = false;
              while (parent != null) {
                if (parent.tagName.toLowerCase() === "div" && (parent.getAttribute("id") === "content-wrapper" || parent.getAttribute("id") === "second-column" || parent.getAttribute("id") === "third-column")) {
                  validParentFound = true;
                  break;
                }
                parent = parent.parentElement;
              }
              if (!validParentFound) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(invalidContentBodyMsg);
              }
            });
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // check for deprecated widgets, classes, or id's
      .pipe(
        through2.obj(function (file, _, cb) {
          //Array for deprecated class or id
          let deprecatedClassOrId = ["main", "main-two-column", "sidebar", "video-container"];
          const deprecatedClassOrIdMsg = "Contains deprecated class or id";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            // Array of classes and IDs to search for
            let classAndIdsToFind = deprecatedClassOrId;
  
            classAndIdsToFind.forEach((item) => {
              let classElements = doc.getElementsByClassName(item);
              let idElements = doc.getElementById(item);
  
              if (classElements.length > 0 || idElements) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(`${deprecatedClassOrIdMsg} (${item})`);
              }
            });
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // check tables
      // log if <table> does not contain .display-lg
      // log if structure does not contain thead > tr > th scope="col"
      .pipe(
        through2.obj(function (file, _, cb) {
          const tableMissingDisplayLgMsg = "A table does not contain '.display-lg'";

          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            // Check all tables for .display-lg
            let tables = doc.querySelectorAll("table");
            tables.forEach((table) => {
              if (!table.classList.contains("display-lg")) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(tableMissingDisplayLgMsg);
              }
            });
            // Check for specific table structure
            tables.forEach((table) => {
              const tableMissingThMsg = "A table does not contain the correct structure (missing <th scope='col'> within <thead>)";
              const tableMissingTrMsg = "A table does not contain the correct structure (missing <tr> within <thead>)";
              const tableMissingTheadMsg = "A table does not contain the correct structure (missing <thead>)";
  
              let thead = table.querySelector("thead");
              if (thead) {
                let tr = thead.querySelector("tr");
                if (tr) {
                  let ths = tr.querySelectorAll("th[scope='col']");
                  if (ths.length === 0) {
                    if (!fileErrors[file.path]) {
                      fileErrors[file.path] = [];
                    }
                    fileErrors[file.path].push(tableMissingThMsg);
                  }
                } else {
                  if (!fileErrors[file.path]) {
                    fileErrors[file.path] = [];
                  }
                  fileErrors[file.path].push(tableMissingTrMsg);
                }
              } else {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(tableMissingTheadMsg);
              }
            });
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // check for matching <title> and <h1>
      .pipe(
        through2.obj(function (file, _, cb) {
          const mismatchedTitleAndH1Msg = "<title> and <h1> do not match";
          const missingTitleOrH1Msg = "Missing <title> or <h1> element";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            // Check if <title> and <h1> match
            let title = doc.querySelector("title");
            let h1 = doc.querySelector("h1");
  
            // Make sure both elements exist before comparing them
            if (title && h1) {
              let titleText = title.textContent.trim();
              let h1Text = h1.textContent.trim();
  
              if (titleText !== h1Text) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(mismatchedTitleAndH1Msg);
              }
            } else {
              if (!fileErrors[file.path]) {
                fileErrors[file.path] = [];
              }
              fileErrors[file.path].push(missingTitleOrH1Msg);
            }
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )

      // check for images without alt attribute
      .pipe(
        through2.obj(function (file, _, cb) {
          const missingImgAltMsg = "An <img> element is missing its alt attribute";
  
          if (file.isBuffer()) {
            let html = file.contents.toString();
            let dom = new JSDOM(html);
            let doc = dom.window.document;
  
            // Check all <img> elements for an alt attribute
            let imgElements = doc.querySelectorAll("img");
            Array.from(imgElements).forEach((img) => {
              if (!img.hasAttribute("alt")) {
                if (!fileErrors[file.path]) {
                  fileErrors[file.path] = [];
                }
                fileErrors[file.path].push(missingImgAltMsg);
              }
            });
  
            file.contents = Buffer.from(dom.serialize());
          }
          cb(null, file);
        })
      )
      .pipe(
        through2.obj(function (file, _, cb) {
          cb(null, file);
        })
      );
      console.log(process.memoryUsage());
    stream.on("finish", () => {
      let fileCount = 1; // Initialize a counter
      for (let filePath in fileErrors) {
        console.log(`${fileCount}. Errors in file ${filePath}:`);
        for (let error of fileErrors[filePath]) {
          console.log(` > ${error}`);
        }
        console.log('--------------------------------------------------');
        fileCount++; // Increment the counter after each file
      }
    });
  });
}