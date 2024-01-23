let grades = {};

let rawCourseData;
let rawJCData;

let sortedCourseData = {};
let sortedGroupCourseData = {};
let courseNameToDataMap = {};
let courseGroupToCourseMap = {};
let coursePolyToCourseMap = {};

let filterCourseNames = {};
let filterCourseGroups = {};

let filterAll = {};
let filterGroup = {};
let filterName = {};
let filterPoly = {};

let scoreToJCMap = {};
let scoreToMIMap = {};

let isFiltered = false;
let isGroupFiltered = false;
let invalidBaseString = "-";

let jcCutoff = 20;
let polyCutoff = 28;

let rangeSelection = 2;

$(function () {
  $("select").formSelect();

  $(".subjGrade").on("change", updateView);

  $("#infoButton").click(function (e) {
    if ($(".disclaimerArea").hasClass("disclaimerAreaShow")) {
      $(".disclaimerArea").removeClass("disclaimerAreaShow");
    } else {
      $(".disclaimerArea").addClass("disclaimerAreaShow");
      $(".excelArea").removeClass("excelAreaShow");
    }
  });

  $(".disclaimerArea").click(function (e) {
    $(".disclaimerArea").removeClass("disclaimerAreaShow");
  });

  $("#excelButton").click(function (e) {
    if ($(".excelArea").hasClass("excelAreaShow")) {
      $(".excelArea").removeClass("excelAreaShow");
    } else {
      $(".excelArea").addClass("excelAreaShow");
      $(".disclaimerArea").removeClass("disclaimerAreaShow");
    }
  });

  $(".excelArea").click(function (e) {
    $(".excelArea").removeClass("excelAreaShow");
  });

  $("#scoreRange").on("change", function (e) {
    rangeSelection = $("#scoreRange").val();
    updateView(e);
  });

  initialiseGrades();

  rawCourseData = courseData;
  rawJCData = jcData;

  // rawCourseData = JSON.parse(courseData);
  // console.log(rawCourseData);

  // rawJCData = JSON.parse(jcData);
  // console.log(rawJCData);

  parseRawCourseData();
  parseRawJCData();

  initialiseSelect2();

  console.log("hello");

  //console.log(sortedCourseData, sortedGroupCourseData, scoreToJCMap);
});

function initialiseSelect2() {
  let names = Object.keys(courseNameToDataMap);
  let groups = Object.keys(courseGroupToCourseMap);
  let poly = Object.keys(coursePolyToCourseMap);

  $("#filterCourseName").select2({
    placeholder: "Filter Course Names",
    data: names,
    matcher: modelMatcher,
  });

  $("#filterCourseName").on("change", filterChangedName);
  $("#filterCourseName").on("select2:unselecting", function (e) {
    // Stops menu from appearing again when removing a filter item
    var opts = $(this).data("select2").options;
    opts.set("disabled", true);
    setTimeout(function () {
      opts.set("disabled", false);
    }, 1);
  });

  $("#filterCourseGroup").select2({
    placeholder: "Filter Course Clusters",
    data: groups,
    matcher: modelMatcher,
  });

  $("#filterCourseGroup").on("change", filterChangedGroup);
  $("#filterCourseGroup").on("select2:unselecting", function (e) {
    // Stops menu from appearing again when removing a filter item
    var opts = $(this).data("select2").options;
    opts.set("disabled", true);
    setTimeout(function () {
      opts.set("disabled", false);
    }, 1);
  });

  $("#filterCoursePoly").select2({
    placeholder: "Filter Poly",
    data: poly,
    matcher: modelMatcher,
  });

  $("#filterCoursePoly").on("change", filterChangedPoly);
  $("#filterCoursePoly").on("select2:unselecting", function (e) {
    // Stops menu from appearing again when removing a filter item
    var opts = $(this).data("select2").options;
    opts.set("disabled", true);
    setTimeout(function () {
      opts.set("disabled", false);
    }, 1);
  });
}

function filterChanged(e) {
  let vals = $(e.target).val();
  let ret = {};

  for (let v of vals) {
    ret[v] = true;
  }

  return ret;
}

function filterChangedGroup(e) {
  filterGroup = {};
  let vals = $(e.target).val();
  for (let v of vals) {
    if (courseGroupToCourseMap[v] !== undefined) {
      for (let cn in courseGroupToCourseMap[v]) {
        filterGroup[cn] = true;
      }
    }
  }
  afterFilterChanged(e);
}

function filterChangedPoly(e) {
  filterPoly = filterChanged(e);
  /*let vals = $(e.target).val();
    for (let v of vals)
    {
        if (courseGroupToCourseMap[v] !== undefined)
        {
            for (let cn in courseGroupToCourseMap[v])
            {
                filterGroup[cn] = true;
            }
        }
    }*/
  afterFilterChanged(e);
}

function afterFilterChanged(e) {
  mergeFilters();
  updateView(e);
}

function filterChangedName(e) {
  filterName = filterChanged(e);

  afterFilterChanged(e);
}

function mergeFilters() {
  filterAll = {};
  let isPolyFilter = Object.keys(filterPoly).length > 0;
  isFiltered = Object.keys(filterGroup).length > 0 || Object.keys(filterName).length > 0;
  isGroupFiltered = Object.keys(filterGroup).length > 0;

  // console.log(isPolyFilter);

  for (let v in filterGroup) {
    if (!isPolyFilter || filterPoly[courseNameToDataMap[v]["polyName"]] !== undefined) {
      filterAll[v] = true;
    }
  }

  for (let v in filterName) {
    if (!isPolyFilter || filterPoly[courseNameToDataMap[v]["polyName"]] !== undefined) {
      filterAll[v] = true;
    }
  }
}

function parseRawJCData() {
  let score = 0;
  let target;

  for (let d of rawJCData) {
    score = d["courseCutoff"];

    if (score === "-") {
      score = 0;
    } else {
      score = Number(score);
    }

    target = scoreToJCMap;
    // console.log(target);
    if (d["jcType"] == "MI") {
      target = scoreToMIMap;
    }
    if (target[score] === undefined) {
      target[score] = [];
    }
    target[score].push(d);
  }
}

function parseRawCourseData() {
  let score = 0;
  let group = "";
  let name = "";
  let clusters = "";
  let poly = "";

  for (let d of rawCourseData) {
    score = d["courseCutoff"];
    group = d["courseGradeType"];
    name = getCourseNameFromCourseData(d);
    clusters = d["courseCluster"];
    poly = d["polyName"];

    if (score == "-") {
      score = 0;
    } else {
      score = Number(score);
    }

    if (sortedCourseData[score] === undefined) {
      sortedCourseData[score] = [];
    }

    sortedCourseData[score].push(d);

    if (sortedGroupCourseData[group] === undefined) {
      sortedGroupCourseData[group] = {};
    }
    if (sortedGroupCourseData[group][score] === undefined) {
      sortedGroupCourseData[group][score] = [];
    }

    sortedGroupCourseData[group][score].push(d);

    courseNameToDataMap[name] = d;
    if (courseGroupToCourseMap[clusters] === undefined) {
      courseGroupToCourseMap[clusters] = {};
    }
    courseGroupToCourseMap[clusters][name] = d;

    if (coursePolyToCourseMap[poly] === undefined) {
      coursePolyToCourseMap[poly] = {};
    }
    coursePolyToCourseMap[poly][name] = d;
  }
}

function getCourseNameFromCourseData(inCourse) {
  return inCourse["courseCode"] + " (" + inCourse["polyName"] + ") " + inCourse["courseTitle"];
}

function initialiseGrades() {
  grades["EL"] = getGradeStruct("gradeEL");
  // grades["ELNA"] = getGradeStruct("gradeELNA");
  grades["HMT"] = getGradeStruct("gradeHMT");
  grades["MT"] = getGradeStruct("gradeMT");
  // grades["MTNA"] = getGradeStruct("gradeMTNA");
  grades["CLB"] = getGradeStruct("gradeCLB");
  grades["HUM"] = getGradeStruct("gradeHum", 2);
  grades["SCI"] = getGradeStruct("gradeSci", 3);
  // grades["SCINA"] = getGradeStruct("gradeSciNA");
  grades["EMATH"] = getGradeStruct("gradeEMath");
  // grades["EMATHNA"] = getGradeStruct("gradeEMathNA");
  grades["AMATH"] = getGradeStruct("gradeAMath");
  grades["DNT"] = getGradeStruct("gradeDNT");
  grades["ART"] = getGradeStruct("gradeArt");
  //grades["HIGHERART"] = getGradeStruct("gradeHigherArt");
  grades["MUSIC"] = getGradeStruct("gradeHigherMusic");
  grades["BONUS"] = getGradeStruct("gradeBonus");
}

function getGradeStruct(id, count = 1) {
  return {
    id: id,
    maxCount: count,
    data: [],
  };
}

function updateView(e) {
  updateGrades();

  let calcScores = {};
  calcScores["L1R5"] = calculateL1R4(5);
  calcScores["L1R4"] = calculateL1R4(0);
  calcScores["base"] = calculateL1R4(0);
  calcScores["typeA"] = calculateL1R4(1);
  calcScores["typeB"] = calculateL1R4(2);
  calcScores["typeC"] = calculateL1R4(3);
  calcScores["typeD"] = calculateL1R4(4);

  let courseSize = {};
  let courses = {};

  let str = "";

  for (let n in calcScores) {
    if (calcScores[n]["score"] == -1) {
      calcScores[n]["score"] = invalidBaseString;
    }
  }

  $("#scoreL1R5").html(calcScores["L1R5"]["score"]);
  $("#scoreL1R4Base").html(calcScores["base"]["score"]);
  $("#scoreL1R4A").html(calcScores["typeA"]["score"]);
  $("#scoreL1R4B").html(calcScores["typeB"]["score"]);
  $("#scoreL1R4C").html(calcScores["typeC"]["score"]);
  $("#scoreL1R4D").html(calcScores["typeD"]["score"]);

  courses["A"] = updateAvailableCourses(
    sortedGroupCourseData["A"],
    calcScores["typeA"]["score"],
    "A"
  );
  courses["B"] = updateAvailableCourses(
    sortedGroupCourseData["B"],
    calcScores["typeB"]["score"],
    "B"
  );
  courses["C"] = updateAvailableCourses(
    sortedGroupCourseData["C"],
    calcScores["typeC"]["score"],
    "C"
  );
  courses["D"] = updateAvailableCourses(
    sortedGroupCourseData["D"],
    calcScores["typeD"]["score"],
    "D"
  );
  courses["JC"] = updateAvailableJCCourses(scoreToJCMap, calcScores["L1R5"]["score"], "JC");
  courses["MI"] = updateAvailableJCCourses(scoreToMIMap, calcScores["L1R4"]["score"], "MI");

  $("#scoreL1R5CourseNum").html(courses["JC"]["data"]);
  $("#scoreL1R4BaseCourseNum").html(courses["MI"]["data"]);
  $("#scoreL1R4ACourseNum").html(courses["A"]["data"]);
  $("#scoreL1R4BCourseNum").html(courses["B"]["data"]);
  $("#scoreL1R4CCourseNum").html(courses["C"]["data"]);
  $("#scoreL1R4DCourseNum").html(courses["D"]["data"]);

  str =
    '<strong>ALWAYS CONFIRM REQUIREMENTS IN JAE BOOKLET</strong><br/><div class="courseGroupAreaTitle">JC / MI</div>' +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreL1R5">L1R5 (' +
    calcScores["L1R5"]["score"] +
    ") [ " +
    calcScores["L1R5"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["JC"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreL1R4">L1R4 (' +
    calcScores["L1R4"]["score"] +
    ") [ " +
    calcScores["L1R4"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["MI"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupAreaTitle">POLY</div>' +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeA">ELR2B2 - A (' +
    calcScores["typeA"]["score"] +
    ") [ " +
    calcScores["typeA"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["A"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeB">ELR2B2 - B (' +
    calcScores["typeB"]["score"] +
    ") [ " +
    calcScores["typeB"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["B"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeC">ELR2B2 - C (' +
    calcScores["typeC"]["score"] +
    ") [ " +
    calcScores["typeC"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["C"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeD">ELR2B2 - D (' +
    calcScores["typeD"]["score"] +
    ") [ " +
    calcScores["typeD"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["D"]["html"] +
    "</div></div></div>";

  $(".courseAvailableArea").html(str);

  $(".courseGroupHide").click(toggleGroupArea);

  // console.log(courses);
}

function toggleGroupArea(e) {
  let targ = $(e.target);
  if (!targ.hasClass("courseGroupArea")) {
    targ = targ.parents(".courseGroupArea");
  }

  if (targ.hasClass("courseGroupHidden")) {
    targ.removeClass("courseGroupHidden");
    $(e.target).html("[ - ]");
  } else {
    targ.addClass("courseGroupHidden");
    $(e.target).html("[ + ]");
  }
}

function updateAvailableCourses(courseData, inScore, courseGroup) {
  // let curScore = calcScores["base"];
  let courseList = [];
  let str = "";
  let ret = {
    data: 0,
    html: "",
  };
  let alerts = "";
  let alertsClass;
  let isPolyFilter = Object.keys(filterPoly).length > 0;
  let actualCount = 0;
  let cutoffDisplay = "";
  let curScore = Number(inScore);

  if (curScore > polyCutoff + rangeSelection || inScore == "-") {
    return ret;
  }

  if (curScore.toString().localeCompare(invalidBaseString) === 0) {
    return ret;
  }

  if (isFiltered) {
    // Only show filtered stuff
    for (let s in filterAll) {
      if (courseNameToDataMap[s] !== undefined) {
        if (courseNameToDataMap[s]["courseGradeType"].localeCompare(courseGroup) === 0) {
          if (
            !isGroupFiltered ||
            curScore - Number(courseNameToDataMap[s]["courseCutoff"]) <= rangeSelection
          ) {
            courseList.push(courseNameToDataMap[s]);
          }
        }
      }
    }
  } else {
    for (let s in courseData) {
      // console.log(curScore, Number(s), curScore - Number(s) <= rangeSelection);
      if (Number(s) === 0 || curScore - Number(s) <= rangeSelection) {
        for (let c in courseData[s]) {
          if (!isPolyFilter || filterPoly[courseData[s][c]["polyName"]] !== undefined) {
            courseList.push(courseData[s][c]);
          }
        }
      }
    }
    // console.log(courseData, courseList);
  }

  courseList.sort(function (a, b) {
    if (a["courseCutoff"] == "-") {
      return -1;
    }
    if (b["courseCutoff"] == "-") {
      return 1;
    }

    return Number(a["courseCutoff"]) - Number(b["courseCutoff"]);
  });

  if (courseList.length > 0) {
    // header row
    str =
      '<div class="row courseGroupRow margin-bottom-0' +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      "Code" +
      '</div><div class="col s1 courseGroupRowPoly">' +
      "Poly" +
      '</div><div class="col s6 courseGroupRowTitle">' +
      "Course Title" +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      "Cutoff" +
      '</div><div class="col s3 courseGroupRowMsg">' +
      "Alerts" +
      "</div></div>";
  }

  for (let c of courseList) {
    alerts = getAlertsFromCourse(c, curScore);
    alertsClass = "";
    if (alerts["alerts"] > 0) {
      alertsClass = " courseGroupRowAlert";
    } else {
      actualCount++;
    }
    cutoffDisplay = c["courseCutoff"];
    if (cutoffDisplay == "-") {
      cutoffDisplay = "NEW";
    }

    str +=
      '<div class="row courseGroupRow margin-bottom-0' +
      alertsClass +
      '"><a target="_blank" href="' +
      c["courseURL"] +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      c["courseCode"] +
      '</div><div class="col s1 courseGroupRowPoly">' +
      c["polyName"] +
      '</div><div class="col s6 courseGroupRowTitle">' +
      c["courseTitle"] +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      cutoffDisplay +
      '</div><div class="col s3 courseGroupRowMsg">' +
      alerts["text"] +
      "</div></a></div>";
  }

  // console.log(courseList);
  // $(".courseAvailableArea").html(str);

  ret["data"] = actualCount;
  ret["html"] = str;

  return ret;
}

function updateAvailableJCCourses(courseData, curScore, courseGroup) {
  let courseList = [];
  let str = "";
  let ret = {
    data: 0,
    html: "",
  };
  let alerts = "";
  let alertsClass;
  let isPolyFilter = Object.keys(filterPoly).length > 0;
  let bonus = getGrade("BONUS");
  if (bonus === undefined) {
    bonus = 0;
  }
  let actualCount = 0;
  let cutoffDisplay = "";

  // cutoff of 20 points hard coded
  // console.log(Number(curScore) + Number(bonus));
  if (Number(curScore) + Number(bonus) > jcCutoff + rangeSelection || curScore == "-") {
    return ret;
  }

  if (curScore.toString().localeCompare(invalidBaseString) === 0) {
    return ret;
  }

  if (isFiltered || isPolyFilter) {
    return ret;
  }

  // console.log("jc", courseData);

  for (let s in courseData) {
    if (Number(s) === 0 || curScore - Number(s) <= rangeSelection) {
      for (let c in courseData[s]) {
        if (!isPolyFilter || filterPoly[courseData[s][c]["jcName"]] !== undefined) {
          courseList.push(courseData[s][c]);
        }
      }
    }
  }

  courseList.sort(function (a, b) {
    if (a["courseCutoff"] == "-") {
      return -1;
    }
    if (b["courseCutoff"] == "-") {
      return 1;
    }

    return Number(a["courseCutoff"]) - Number(b["courseCutoff"]);
  });

  if (courseList.length > 0) {
    // header row
    str =
      '<div class="row courseGroupRow margin-bottom-0' +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      "Code" +
      '</div><div class="col s4 courseGroupRowPoly">' +
      "JC/MI" +
      '</div><div class="col s3 courseGroupRowTitle">' +
      "Stream" +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      "Cutoff" +
      '</div><div class="col s3 courseGroupRowMsg">' +
      "Alerts" +
      "</div></div>";
  }

  for (let c of courseList) {
    alerts = getAlertsFromJCCourse(c, curScore);
    alertsClass = "";
    if (alerts["alerts"] > 0) {
      alertsClass = " courseGroupRowAlert";
    } else {
      actualCount++;
    }
    cutoffDisplay = c["courseCutoff"];
    if (cutoffDisplay == "-") {
      cutoffDisplay = "NEW";
    }
    str +=
      '<div class="row courseGroupRow margin-bottom-0' +
      alertsClass +
      '"><a target="_blank" href="' +
      c["courseURL"] +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      c["courseCode"] +
      '</div><div class="col s4 courseGroupRowPoly">' +
      c["jcName"] +
      '</div><div class="col s3 courseGroupRowTitle">' +
      c["courseType"] +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      cutoffDisplay +
      '</div><div class="col s3 courseGroupRowMsg">' +
      alerts["text"] +
      "</div></a></div>";
  }
  ret["data"] = actualCount;

  //console.log(courseList);

  //$(".courseAvailableArea").html(str);

  ret["html"] = str;

  return ret;
}

function updateGrades() {
  let tmpGrade;
  let id;
  for (let n in grades) {
    grades[n]["data"] = [];
    for (let i = 0; i < grades[n]["maxCount"]; i++) {
      id = grades[n]["id"];
      if (grades[n]["maxCount"] > 1) {
        id += "" + (i + 1);
      }

      tmpGrade = $("#" + id).val();

      //console.log(id, $("#" + id), "grade: " + tmpGrade);
      if (tmpGrade != undefined && tmpGrade != -1) {
        grades[n]["data"].push({
          grade: tmpGrade,
          subjName: n + " " + (i + 1),
        });
      }
    }
    grades[n]["data"].sort(function (a, b) {
      return Number(a["grade"]) - Number(b["grade"]);
    });
  }

  //console.log(grades);
}

function getAlertsFromCourse(inCourse, curScore) {
  let gradeEL = getGrade("EL");
  let gradeEMath = getGrade("EMATH");
  let gradeHMT = getGrade("HMT") || 99;
  let gradeMT = getGrade("MT") || 99;
  let gradeAMath = getGrade("AMATH");
  let cutEL = Number(inCourse["courseGradeEL"].substring(1));
  let cutMath = Number(inCourse["courseGradeMaths"].substring(1) || 99);
  let cutoff = Number(inCourse["courseCutoff"] || 99);
  let courseCode = inCourse["courseCode"];
  let ret = {
    alerts: 0,
    text: "",
  };

  if (gradeEL !== undefined && (gradeEMath !== undefined || gradeAMath !== undefined)) {
    //console.log(cutEL, cutMath, cutoff);

    if (cutoff !== NaN) {
      if (curScore > cutoff) {
        ret["text"] += "You need to lower your score by " + (curScore - cutoff) + " point(s)<br/>";
        ret["alerts"] += 1;
      }
    }
    if (gradeEL > cutEL) {
      ret["text"] += "A " + inCourse["courseGradeEL"] + " in EL is required<br/>";
      ret["alerts"] += 1;
    }

    if (gradeEMath !== undefined && gradeAMath !== undefined) {
      if (gradeEMath > cutMath && gradeAMath > cutMath) {
        ret["text"] += "A " + inCourse["courseGradeMaths"] + " in E-Math/ A-Math is required<br/>";
        ret["alerts"] += 1;
      }
    } else if (gradeEMath > cutMath || gradeAMath > cutMath) {
      ret["text"] += "A " + inCourse["courseGradeMaths"] + " in E-Math/ A-Math is required<br/>";
      ret["alerts"] += 1;
    }

    if (courseCode === "N70" && gradeHMT > 4 && gradeMT > 2) {
      ret["text"] += "A B4 in HCL or an A2 in CL is required<br/>";
      ret["alerts"] += 1;
    } else if (courseCode === "N88" && gradeHMT > 4 && gradeMT > 3) {
      ret["text"] += "A B4 in HCL or an B3 in CL is required<br/>";
      ret["alerts"] += 1;
    } else if (courseCode === "N95" && gradeHMT > 4 && gradeMT > 2) {
      ret["text"] += "A B4 in HTL or an A2 in TL is required<br/>";
      ret["alerts"] += 1;
    }
  }

  return ret;
}

function getAlertsFromJCCourse(inCourse, curScore) {
  let gradeEL = getGrade("EL");
  let gradeEMath = getGrade("EMATH");
  let gradeAMath = getGrade("AMATH");
  let gradeCL = getGrade("MT");
  let gradeCLB = getGrade("CLB");
  let cutoff = Number(inCourse["courseCutoff"]);
  let ret = {
    alerts: 0,
    text: "",
  };

  if (cutoff !== NaN) {
    if (curScore > cutoff) {
      ret["text"] += "You need to lower your score by " + (curScore - cutoff) + " point(s)<br/>";
      ret["alerts"] += 1;
    }
  }
  if (gradeEL === undefined || gradeEL > 6) {
    ret["text"] += "A pass in EL is required<br/>";
    ret["alerts"] += 1;
  }
  if (
    !((gradeEMath !== undefined && gradeEMath < 7) || (gradeAMath !== undefined && gradeAMath < 7))
  ) {
    ret["text"] += "A pass in E-Math / A-Math is required<br/>";
    ret["alerts"] += 1;
  }
  if (gradeCL > 7) {
    if (gradeCLB > 2 || gradeCLB === undefined) {
      ret["text"] += "A D7 in CL or Merit/Pass in CLB is required<br/>";
      ret["alerts"] += 1;
    }
  }

  return ret;
}

function calculateL1R4(type) {
  let count = countSubjects();
  console.log(count);
  let minSubjs = 5;

  let scoreData = {
    score: -1,
    chosenSubjs: [],
  };
  let score = -1;
  let tmpScoreData = {
    score: -1,
    chosenSubjs: [],
  };

  let ret;

  let tmpScore = -1;
  let useHMT;
  let checkELHMT = false;

  if (type > 4) {
    minSubjs = 6;
  }
  if (count < minSubjs) {
    return scoreData;
  }

  if (getGrade("EL") === undefined) {
    return scoreData;
  }

  let baseEL = getGrade("EL");
  let baseHMT = getGrade("HMT");
  let bonus = getGrade("BONUS");
  let useBonus = false;

  let basePool = createGradePool();
  // console.log(basePool);
  let selectedGroups = [];

  switch (type) {
    // Basic L1R4
    case 0:
      // R1
      selectedGroups.push(["HUM", "EMATH", "AMATH", "SCI"]);
      // R2
      selectedGroups.push(["HUM", "EMATH", "AMATH", "SCI"]);
      // R3
      selectedGroups.push(["ALL"]);
      // R4
      selectedGroups.push(["ALL"]);
      useHMT = true;
      useBonus = true;
      checkELHMT = true;
      break;
    // Type A
    case 1:
      // R1
      selectedGroups.push(["HUM", "ART", "DNT", "MUSIC"]);
      // R2
      selectedGroups.push(["HUM", "ART", "EMATH", "AMATH", "DNT", "MT", "MUSIC"]);
      // R3
      selectedGroups.push(["ALL"]);
      // R4
      selectedGroups.push(["ALL"]);
      useHMT = false;
      useBonus = false;
      break;
    // Type B
    case 2:
      // R1
      selectedGroups.push(["EMATH", "AMATH"]);
      // R2
      selectedGroups.push(["ART", "HUM", "MUSIC"]);
      // R3
      selectedGroups.push(["ALL"]);
      // R4
      selectedGroups.push(["ALL"]);
      useHMT = false;
      useBonus = false;
      break;
    // Type C
    case 3:
      // R1
      selectedGroups.push(["EMATH", "AMATH"]);
      // R2
      selectedGroups.push(["SCI", "DNT"]);
      // R3
      selectedGroups.push(["ALL"]);
      // R4
      selectedGroups.push(["ALL"]);
      useHMT = false;
      useBonus = false;
      break;
    // Type D
    case 4:
      // R1
      selectedGroups.push(["EMATH", "AMATH"]);
      // R2
      selectedGroups.push(["SCI", "DNT", "ART"]);
      // R3
      selectedGroups.push(["ALL"]);
      // R4
      selectedGroups.push(["ALL"]);
      useHMT = false;
      useBonus = false;
      break;
    // L1R5
    case 5:
      // R1
      selectedGroups.push(["HUM", "ART"]);
      // R2
      selectedGroups.push(["SCI", "EMATH", "AMATH"]);
      // R3
      selectedGroups.push(["SCI", "EMATH", "AMATH", "HUM", "ART"]);
      // R4
      selectedGroups.push(["ALL"]);
      // R5
      selectedGroups.push(["ALL"]);
      useHMT = true;
      useBonus = true;
      checkELHMT = true;
      break;
  }
  console.log("EL", basePool, selectedGroups);

  scoreData = getScoreFromGroups(basePool, selectedGroups);
  // console.log(scoreData);

  if (scoreData["score"] !== -1) {
    scoreData["score"] = Number(baseEL) + scoreData["score"];
    scoreData["chosenSubjs"].unshift("EL");
  }

  if (useHMT) {
    basePool = createGradePool(1);

    // console.log("HMT", basePool, selectedGroups);

    tmpScoreData = getScoreFromGroups(basePool, selectedGroups);
    if (tmpScoreData["score"] !== -1) {
      tmpScoreData["score"] = Number(baseHMT) + tmpScoreData["score"];
      tmpScoreData["chosenSubjs"].unshift("HMT");
    }
  }

  // console.log(scoreData, tmpScoreData);

  if (tmpScoreData["score"] === -1) {
    tmpScoreData = scoreData;
  }

  if (useHMT && tmpScoreData["score"] === scoreData["score"]) {
    if (baseEL > baseHMT) {
      ret = tmpScoreData;
    } else {
      ret = scoreData;
    }
  } else {
    ret = Number(scoreData["score"]) > Number(tmpScoreData["score"]) ? tmpScoreData : scoreData;
  }

  if (useBonus && bonus !== undefined) {
    ret["score"] -= bonus;
  }

  if (checkELHMT) {
    if (scoreData["chosenSubjs"][0] === "EL") {
      let lastSubj = scoreData["chosenSubjs"][scoreData["chosenSubjs"].length - 1].split(" ")[0];
      let subjNum = scoreData["chosenSubjs"][scoreData["chosenSubjs"].length - 1].split(" ")[1];
      let MTGrade = $("#gradeMT").val();

      if (lastSubj === "HUM") {
        let humGrade = $("#gradeHum" + subjNum).val();
        if (humGrade > Number(baseHMT) && !scoreData["chosenSubjs"].includes("MT 1")) {
          scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(humGrade);
          scoreData["chosenSubjs"].pop();
          scoreData["chosenSubjs"].push("HMT");
        } else if (humGrade > Number(baseHMT) && scoreData["chosenSubjs"].includes("MT 1")) {
          if (MTGrade > Number(baseHMT)) {
            scoreData["chosenSubjs"].indexOf("MT 1") !== -1 &&
              scoreData["chosenSubjs"].splice(scoreData["chosenSubjs"].indexOf("MT 1"), 1);
            scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(MTGrade);
            scoreData["chosenSubjs"].pop();
            scoreData["chosenSubjs"].push("HMT");
          }
        }
      } else if (lastSubj === "SCI") {
        let sciGrade = $("#gradeSci" + subjNum).val();
        if (sciGrade > Number(baseHMT) && !scoreData["chosenSubjs"].includes("MT 1")) {
          scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(sciGrade);
          scoreData["chosenSubjs"].pop();
          scoreData["chosenSubjs"].push("HMT");
        } else if (sciGrade > Number(baseHMT) && scoreData["chosenSubjs"].includes("MT 1")) {
          if (MTGrade > Number(baseHMT)) {
            scoreData["chosenSubjs"].indexOf("MT 1") !== -1 &&
              scoreData["chosenSubjs"].splice(scoreData["chosenSubjs"].indexOf("MT 1"), 1);
            scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(MTGrade);
            scoreData["chosenSubjs"].pop();
            scoreData["chosenSubjs"].push("HMT");
          }
        }
      } else if (lastSubj === "MT") {
        // let MTGrade = $("#gradeMT").val();
        if (MTGrade > Number(baseHMT)) {
          scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(MTGrade);
          scoreData["chosenSubjs"].pop();
          scoreData["chosenSubjs"].push("HMT");
        }
      } else {
        let subjMark = getGrade(lastSubj, 0);
        if (subjMark > Number(baseHMT) && !scoreData["chosenSubjs"].includes("MT 1")) {
          scoreData["score"] = Number(baseHMT) + scoreData["score"] - Number(subjMark);
          scoreData["chosenSubjs"].pop();
          scoreData["chosenSubjs"].push("HMT");
        }
      }
    }
  }

  return ret;
}

function getScoreFromGroups(basePool, selectedGroups) {
  let score = 0;
  let chosen = [];
  let scoreSubjs = [];
  let grps = [];
  let ret = {
    score: -1,
    chosenSubjs: [],
  };
  if (selectedGroups.length === 0) {
    return ret;
  }

  // console.log("selected", selectedGroups);
  //console.log("score check", basePool);

  for (let g of selectedGroups) {
    if (g[0].localeCompare("ALL") === 0) {
      grps = Object.keys(basePool);
    } else {
      grps = g;
    }
    chosen = [];
    for (let s of grps) {
      if (basePool[s] !== undefined && basePool[s].length > 0) {
        chosen.push({
          score: basePool[s][0]["grade"],
          subj: s,
          subjName: basePool[s][0]["subjName"],
        });
      }
    }
    // console.log(basePool);
    chosen.sort(function (a, b) {
      return Number(a["score"]) - Number(b["score"]);
    });

    //console.log(chosen);
    if (chosen.length == 0) {
      return ret;
    }
    score += Number(basePool[chosen[0]["subj"]].shift()["grade"]);
    scoreSubjs.push(chosen[0]["subjName"]);
  }
  //console.log(scoreSubjs, score);
  ret["score"] = score;
  ret["chosenSubjs"] = scoreSubjs;
  return ret;
}

// Adds all grades to pool except for EL and HMT (and MT / CLB if HMT is base)
function createGradePool(baseType = 0) {
  let ret = {};
  let ignored = {
    EL: 1,
    HMT: 1,
    CLB: 1,
    BONUS: 1,
  };

  // HMT base, ignore CLB / MT
  if (baseType === 1) {
    ignored["CLB"] = 1;
    ignored["MT"] = 1;
  }

  for (let n in grades) {
    //console.log(n);
    if (ignored[n] === undefined) {
      ret[n] = Array.from(grades[n]["data"]);
    }
    /*else
        {
            console.log("Ignored");
        }*/
  }

  //console.log("Type: ", baseType, Array.from(ret));
  // console.log(ret);

  return ret;
}

function countSubjects() {
  let count = 0;
  for (let n in grades) {
    count += grades[n]["data"].length;
  }

  return count;
}

function getGrade(name, num = 0) {
  if (grades && grades[name] !== undefined) {
    if (grades[name]["data"][num] !== undefined) {
      return grades[name]["data"][num]["grade"];
    }
  }

  return undefined;
}

function convertStringArrayToString(arr) {
  //console.log(arr);
  let ret = "";

  for (let v of arr) {
    ret += v + " ";
  }

  return ret.trim();
}

function modelMatcher(params, data) {
  data.parentText = data.parentText || "";

  // Always return the object if there is nothing to compare
  if ($.trim(params.term) === "") {
    return data;
  }

  // Do a recursive check for options with children
  if (data.children && data.children.length > 0) {
    // Clone the data object if there are children
    // This is required as we modify the object to remove any non-matches
    var match = $.extend(true, {}, data);
    //console.log(data);

    // Check each child of the option
    for (var c = data.children.length - 1; c >= 0; c--) {
      var child = data.children[c];
      child.parentText += data.parentText + " " + data.text;

      var matches = modelMatcher(params, child);

      // If there wasn't a match, remove the object in the array
      if (matches == null) {
        match.children.splice(c, 1);
      }
    }

    // If any children matched, return the new object
    if (match.children.length > 0) {
      return match;
    }

    // If there were no matching children, check just the plain object
    return modelMatcher(params, match);
  }

  // If the typed-in term matches the text of this term, or the text from any
  // parent term, then it's a match.
  var original = (data.parentText + " " + data.text).toUpperCase();
  var term = params.term.toUpperCase();

  let split = term.split(" ");

  // Check if the text contains the term
  for (let t of split) {
    if (t.length > 0) {
      if (original.indexOf(t) == -1) {
        return null;
      }
    }
  }

  // If it doesn't contain the term, don't return anything
  return data;
}
