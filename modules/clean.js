// gulpfile.js
import gulp from "gulp";
import beautify from "gulp-jsbeautifier";
import { cleanTextElements } from "./clean/cleanTextElements.js";
import { cleanElementAttributes } from "./clean/cleanElementAttributes.js";
import { cleanTableAttributes } from "./clean/cleanTableAttributes.js";
import { removeTargetAttributes } from "./clean/removeTargetAttributes.js";
import { removeRolePresentation } from "./clean/removeRolePresentation.js";
import { matchTitleToH1 } from "./clean/matchTitleToH1.js";
import { cleanImageAttributes } from "./clean/cleanImageAttributes.js";
import { removeContentBodyInnerTags } from "./clean/removeContentBodyInnerTags.js";
import { removeJQueryScript } from "./clean/removeJQueryScript.js";

export function clean() {
  // This task is triggered by `npm run clean` from server/index.js.
  // It should ONLY process HTML files, as the server has already copied all other files (like images).
  gulp.task("clean-copy", () => {
    return gulp
      .src("_input/**/*.{html,htm}")
      .pipe(cleanTextElements())
      .pipe(cleanElementAttributes())
      .pipe(cleanTableAttributes())
      .pipe(removeContentBodyInnerTags())
      .pipe(removeJQueryScript())
      .pipe(removeTargetAttributes())
      .pipe(removeRolePresentation())
      .pipe(matchTitleToH1())
      .pipe(cleanImageAttributes())
      .pipe(beautify({ indent_size: 2, wrap_attributes: false, extra_liners: [] }))
      .pipe(beautify.reporter())
      .pipe(gulp.dest("_input"));
  });
}