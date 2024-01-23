let grades = {};

let rawDPPData;
let rawPFPData;
let retArr = [];
let sortedCourseData = {};
let sortedGroupCourseData = {};
let sortedPFPGroupCourseData = {};
let courseNameToDataMap = {};
let courseGroupToCourseMap = {};
let courseITEToCourseMap = {};
let best3Score;
let filterCourseNames = {};
let filterCourseGroups = {};
let isPFP = false;
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
let polyCutoff = 26;
let pfpCutoff = 12;
let dppCutoff = 19;
let ELSubGrade;
let EMathSubGrade;

let rangeSelection = 2;

$(document).ready(function () {
  $("select").formSelect();

  $(".subjGrade").on("change", updateView);

  $("#ELNA").click(function (e) {
    $("#gradeELNA").prop("disabled", false);
    $("#gradeEL").prop("disabled", true);
    $("#gradeEL").prop("value", -1);
  });

  $("#gradeELNA").on("change", function (e) {
    $("#gradeELNA").prop("disabled", false);
    $("#gradeEL").prop("disabled", true);
    $("#gradeEL").prop("value", -1);
    $("#ELNA").prop("checked", true);
  });

  $("#ELEx").click(function (e) {
    $("#gradeEL").prop("disabled", false);
    $("#gradeELNA").prop("disabled", true);
    $("#gradeELNA").prop("value", -1);
  });

  $("#gradeEL").on("change", function (e) {
    $("#gradeEL").prop("disabled", false);
    $("#gradeELNA").prop("disabled", true);
    $("#gradeELNA").prop("value", -1);
    $("#ELEx").prop("checked", true);
  });

  $("#MTNA").click(function (e) {
    $("#gradeMTNA").prop("disabled", false);
    $("#gradeMT").prop("disabled", true);
    $("#gradeMT").prop("value", -1);
  });

  $("#gradeMTNA").on("change", function (e) {
    $("#gradeMTNA").prop("disabled", false);
    $("#gradeMT").prop("disabled", true);
    $("#gradeMT").prop("value", -1);
    $("#MTNA").prop("checked", true);
  });

  $("#MTEx").click(function (e) {
    $("#gradeMT").prop("disabled", false);
    $("#gradeMTNA").prop("disabled", true);
    $("#gradeMTNA").prop("value", -1);
  });

  $("#gradeMT").on("change", function (e) {
    $("#gradeMT").prop("disabled", false);
    $("#gradeMTNA").prop("disabled", true);
    $("#gradeMTNA").prop("value", -1);
    $("#MTEx").prop("checked", true);
  });

  $("#HumNA").click(function (e) {
    $("#gradeHumNA").prop("disabled", false);
    $("#gradeHum").prop("disabled", true);
    $("#gradeHum").prop("value", -1);
  });

  $("#gradeHumNA").on("change", function (e) {
    $("#gradeHumNA").prop("disabled", false);
    $("#gradeHum").prop("disabled", true);
    $("#gradeHum").prop("value", -1);
    $("#HumNA").prop("checked", true);
  });

  $("#HumEx").click(function (e) {
    $("#gradeHum").prop("disabled", false);
    $("#gradeHumNA").prop("disabled", true);
    $("#gradeHumNA").prop("value", -1);
  });

  $("#gradeHum").on("change", function (e) {
    $("#gradeHum").prop("disabled", false);
    $("#gradeHumNA").prop("disabled", true);
    $("#gradeHumNA").prop("value", -1);
    $("#HumEx").prop("checked", true);
  });

  $("#SciNA").click(function (e) {
    $("#gradeSciNA").prop("disabled", false);
    $("#gradeSci").prop("disabled", true);
    $("#gradeSci").prop("value", -1);
  });

  $("#gradeSciNA").on("change", function (e) {
    $("#gradeSciNA").prop("disabled", false);
    $("#gradeSci").prop("disabled", true);
    $("#gradeSci").prop("value", -1);
    $("#SciNA").prop("checked", true);
  });

  $("#SciEx").click(function (e) {
    $("#gradeSciNA").prop("disabled", true);
    $("#gradeSci").prop("disabled", false);
    $("#gradeSciNA").prop("value", -1);
  });

  $("#gradeSci").on("change", function (e) {
    $("#gradeSciNA").prop("disabled", true);
    $("#gradeSci").prop("disabled", false);
    $("#gradeSciNA").prop("value", -1);
    $("#SciEx").prop("checked", true);
  });

  $("#EMathNA").click(function (e) {
    $("#gradeEMath").prop("disabled", true);
    $("#gradeEMathNA").prop("disabled", false);
    $("#gradeEMath").prop("value", -1);
  });

  $("#gradeEMathNA").on("change", function (e) {
    $("#gradeEMath").prop("disabled", true);
    $("#gradeEMathNA").prop("disabled", false);
    $("#gradeEMath").prop("value", -1);
    $("#EMathNA").prop("checked", true);
  });

  $("#EMathEx").click(function (e) {
    $("#gradeEMath").prop("disabled", false);
    $("#gradeEMathNA").prop("disabled", true);
    $("#gradeEMathNA").prop("value", -1);
  });

  $("#gradeEMath").on("change", function (e) {
    $("#gradeEMath").prop("disabled", false);
    $("#gradeEMathNA").prop("disabled", true);
    $("#gradeEMathNA").prop("value", -1);
    $("#EMathEx").prop("checked", true);
  });

  $("#AMathNA").click(function (e) {
    $("#gradeAMath").prop("disabled", true);
    $("#gradeAMathNA").prop("disabled", false);
    $("#gradeAMath").prop("value", -1);
  });

  $("#gradeAMathNA").on("change", function (e) {
    $("#gradeAMath").prop("disabled", true);
    $("#gradeAMathNA").prop("disabled", false);
    $("#gradeAMath").prop("value", -1);
    $("#AMathNA").prop("checked", true);
  });

  $("#AMathEx").click(function (e) {
    $("#gradeAMath").prop("disabled", false);
    $("#gradeAMathNA").prop("disabled", true);
    $("#gradeAMathNA").prop("value", -1);
  });

  $("#gradeAMath").on("change", function (e) {
    $("#gradeAMath").prop("disabled", false);
    $("#gradeAMathNA").prop("disabled", true);
    $("#gradeAMathNA").prop("value", -1);
    $("#AMathEx").prop("checked", true);
  });

  $("#infoButton").click(function (e) {
    if ($(".disclaimerArea").hasClass("disclaimerAreaShow")) {
      $(".disclaimerArea").removeClass("disclaimerAreaShow");
    } else {
      $(".disclaimerArea").addClass("disclaimerAreaShow");
      $(".excelArea").removeClass("excelAreaShow");
      $(".conditionsArea").removeClass("conditionsAreaShow");
    }
  });

  $(".disclaimerArea").click(function (e) {
    $(".disclaimerArea").removeClass("disclaimerAreaShow");
  });

  $("#conditionsButton").click(function (e) {
    if ($(".conditionsArea").hasClass("conditionsAreaShow")) {
      $(".conditionsArea").removeClass("conditionsAreaShow");
    } else {
      $(".conditionsArea").addClass("conditionsAreaShow");
      $(".disclaimerArea").removeClass("disclaimerAreaShow");
      $(".excelArea").removeClass("excelAreaShow");
    }
  });

  $(".conditionsArea").click(function (e) {
    $(".conditionsArea").removeClass("conditionsAreaShow");
  });

  $("#excelButton").click(function (e) {
    if ($(".excelArea").hasClass("excelAreaShow")) {
      $(".excelArea").removeClass("excelAreaShow");
    } else {
      $(".excelArea").addClass("excelAreaShow");
      $(".disclaimerArea").removeClass("disclaimerAreaShow");
      $(".conditionsArea").removeClass("conditionsAreaShow");
    }
  });

  $(".excelArea").click(function (e) {
    $(".excelArea").removeClass("excelAreaShow");
  });

  $("#scoreRange").on("change", function (e) {
    rangeSelection = $("#scoreRange").val();
    updateView(e);
    console.log(rangeSelection);
  });

  initialiseGrades();

  rawDPPData = dppCourseData;
  rawPFPData = pfpCourseData;
  // rawDPPData = JSON.parse(dppCourseData);
  // console.log(rawDPPData);
  // rawPFPData = JSON.parse(pfpCourseData);
  // console.log(rawPFPData);
  parseRawDPPCourseData();
  parseRawPFPData();
  // initialiseSelect2();
  // console.log(sortedCourseData, sortedGroupCourseData, scoreToJCMap);
});

// function initialiseSelect2()
// {
//     let names = Object.keys(courseNameToDataMap);
//     let groups = Object.keys(courseGroupToCourseMap);
//     let poly = Object.keys(courseITEToCourseMap);

//     $("#filterCourseName").select2({
//         placeholder: 'Filter Course Names',
//         data: names,
//         matcher: modelMatcher
//     });

//     $("#filterCourseName").on("change", filterChangedName);
//     $("#filterCourseName").on("select2:unselecting", function(e) {	// Stops menu from appearing again when removing a filter item
//         var opts = $(this).data('select2').options;
//         opts.set('disabled', true);
//         setTimeout(function() {
//             opts.set('disabled', false);
//         }, 1);
//     });

//     $("#filterCourseGroup").select2({
//         placeholder: 'Filter Course Clusters',
//         data: groups,
//         matcher: modelMatcher
//     });

//     $("#filterCourseGroup").on("change", filterChangedGroup);
//     $("#filterCourseGroup").on("select2:unselecting", function(e) {	// Stops menu from appearing again when removing a filter item
//         var opts = $(this).data('select2').options;
//         opts.set('disabled', true);
//         setTimeout(function() {
//             opts.set('disabled', false);
//         }, 1);
//     });

//     $("#filterCoursePoly").select2({
//         placeholder: 'Filter Poly',
//         data: poly,
//         matcher: modelMatcher
//     });

//     $("#filterCoursePoly").on("change", filterChangedPoly);
//     $("#filterCoursePoly").on("select2:unselecting", function(e) {	// Stops menu from appearing again when removing a filter item
//         var opts = $(this).data('select2').options;
//         opts.set('disabled', true);
//         setTimeout(function() {
//             opts.set('disabled', false);
//         }, 1);
//     });
// }

// function filterChanged(e)
// {
//     let vals = $(e.target).val();
//     let ret = {};

//     for (let v of vals)
// 	{
// 		ret[v] = true;
//     }

//     return ret;
// }

// function filterChangedGroup(e)
// {
//     filterGroup = {};
//     let vals = $(e.target).val();
//     for (let v of vals)
// 	{
//         if (courseGroupToCourseMap[v] !== undefined)
//         {
//             for (let cn in courseGroupToCourseMap[v])
//             {
//                 filterGroup[cn] = true;
//             }
//         }
//     }
//     afterFilterChanged(e);
// }

// function filterChangedPoly(e)
// {
//     filterPoly = filterChanged(e);
//     /*let vals = $(e.target).val();
//     for (let v of vals)
// 	{
//         if (courseGroupToCourseMap[v] !== undefined)
//         {
//             for (let cn in courseGroupToCourseMap[v])
//             {
//                 filterGroup[cn] = true;
//             }
//         }
//     }*/
//     afterFilterChanged(e);
// }

// function afterFilterChanged(e)
// {
//     mergeFilters();
//     updateView(e);
// }

// function filterChangedName(e)
// {
//     filterName = filterChanged(e);

//     afterFilterChanged(e);
// }

// function mergeFilters()
// {
//     filterAll = {};
//     let isPolyFilter = Object.keys(filterPoly).length > 0;
//     isFiltered = Object.keys(filterGroup).length > 0 || Object.keys(filterName).length > 0;
//     isGroupFiltered = Object.keys(filterGroup).length > 0;

//     //console.log(isPolyFilter);

//     for (let v in filterGroup)
//     {
//         if (!isPolyFilter || filterPoly[courseNameToDataMap[v]["polyName"]] !== undefined)
//         {
//             filterAll[v] = true;
//         }
//     }

//     for (let v in filterName)
//     {
//         if (!isPolyFilter || filterPoly[courseNameToDataMap[v]["polyName"]] !== undefined)
//         {
//             filterAll[v] = true;
//         }
//     }
// }

function parseRawPFPData() {
  let score = "";
  let target;
  let group = "";
  for (let d of rawPFPData) {
    group = d["courseGroup"];
    // score = d["courseCutoff"];
    // if (sortedPFPGroupCourseData[score] === undefined) {
    //   sortedPFPGroupCourseData[score] = {};
    // }
    // sortedPFPGroupCourseData[group].push(d);
    if (sortedPFPGroupCourseData[group] === undefined) {
      sortedPFPGroupCourseData[group] = [];
    }
    sortedPFPGroupCourseData[group].push(d);
  }
  //   console.log("thisisdata", sortedPFPGroupCourseData);
}

function parseRawDPPCourseData() {
  let score = 0;
  let group = "";
  let name = "";
  let clusters = "";
  let ITE = "";

  for (let d of rawDPPData) {
    // score = d["courseCutoff"];
    // console.log(d["emb3"]);
    score = d["emb3"];
    // group = d["courseGradeType"];
    group = d["courseCategory"];
    name = getDPPCourseNameFromCourseData(d);
    clusters = d["courseCategory"];
    ITE = d["college"];

    score = Number(score);

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

    if (courseITEToCourseMap[ITE] === undefined) {
      courseITEToCourseMap[ITE] = {};
    }
    courseITEToCourseMap[ITE][name] = d;
  }

  //   console.log(courseITEToCourseMap);
}

function getDPPCourseNameFromCourseData(inCourse) {
  return inCourse["courseCode"] + " (" + inCourse["college"] + ") " + inCourse["courseName"];
}

function initialiseGrades() {
  grades["EL"] = getGradeStruct("gradeEL");
  grades["EL(NA)"] = getGradeStruct("gradeELNA");
  grades["HMT"] = getGradeStruct("gradeHMT");
  grades["MT"] = getGradeStruct("gradeMT");
  grades["MT(NA)"] = getGradeStruct("gradeMTNA");
  grades["CLB"] = getGradeStruct("gradeCLB");
  grades["HUM"] = getGradeStruct("gradeHum");
  grades["HUM(NA)"] = getGradeStruct("gradeHumNA");
  grades["SCI"] = getGradeStruct("gradeSci");
  grades["SCI(NA)"] = getGradeStruct("gradeSciNA");
  grades["EMATH"] = getGradeStruct("gradeEMath");
  grades["EMATH(NA)"] = getGradeStruct("gradeEMathNA");
  grades["AMATH"] = getGradeStruct("gradeAMath");
  grades["AMATH(NA)"] = getGradeStruct("gradeAMathNA");
  grades["DNT"] = getGradeStruct("gradeDNT");
  grades["ART"] = getGradeStruct("gradeArt");
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
  var strJIE = "JIE BOOKLET";
  var JIELink = strJIE.link(
    "https://www.ite.edu.sg/docs/default-source/admissions-docs/full-time/publications/admission-booklet/gce-n-admission-booklet-2020.pdf"
  );
  updateGrades();
  let calcScores = {};
  calcScores["AppliedSci"] = calculateEMB3(1);
  calcScores["Engineering"] = calculateEMB3(1);
  calcScores["InfoCom"] = calculateEMB3(1);
  calcScores["Business"] = calculateEMB3(1);
  calcScores["Group1"] = calculateEMB3(0, 1);
  calcScores["Group2"] = calculateEMB3(0, 2);
  // on calculateem3(0) then to getscorefromgroups

  let courseSize = {};
  let courses = {};

  let str = "";

  for (let n in calcScores) {
    if (calcScores[n]["score"] == -1) {
      calcScores[n]["score"] = invalidBaseString;
    }
  }

  // Getting the user's input for English and EMath to print the EMB3 points table
  if ($("#gradeEL").val() === undefined && $("#gradeELNA").val() === undefined) {
    return;
  } else if ($("#gradeEL").val() != -1) {
    ELSubGrade = $("#gradeEL").val();
  } else if ($("#gradeELNA").val() != -1) {
    ELSubGrade = $("#gradeELNA").val();
  }

  if ($("#gradeEMath").val() === undefined && $("#gradeEMathNA").val() === undefined) {
    return;
  } else if ($("#gradeEMath").val() != -1) {
    EMathSubGrade = $("#gradeEMath").val();
  } else if ($("#gradeEMathNA").val() != -1) {
    EMathSubGrade = $("#gradeEMathNA").val();
  }

  if (ELSubGrade == 4 && EMathSubGrade < 5) {
    // $("#EMB3CourseNum5").html("NA");
    for (let i = 5; i < 11; i++) {
      $("#EMB3CourseNum" + i).html("NA");
    }
    $("#EMB3CourseNum11").html("15");
    $("#EMB3CourseNum12").html("13");
    $("#EMB3CourseNum13").html("8");
    $("#EMB3CourseNum14").html("7");
    $("#EMB3CourseNum15").html("4");
    for (let j = 16; j < 20; j++) {
      $("#EMB3CourseNum" + j).html("0");
    }
  } else if (ELSubGrade == 3 && EMathSubGrade < 5) {
    // $("#EMB3CourseNum5").html("NA");
    for (let i = 5; i < 10; i++) {
      $("#EMB3CourseNum" + i).html("NA");
    }
    $("#EMB3CourseNum10").html("30");
    $("#EMB3CourseNum11").html("23");
    $("#EMB3CourseNum12").html("17");
    $("#EMB3CourseNum13").html("8");
    $("#EMB3CourseNum14").html("7");
    $("#EMB3CourseNum15").html("4");
    for (let j = 16; j < 20; j++) {
      $("#EMB3CourseNum" + j).html("0");
    }
  } else if (ELSubGrade < 3 && EMathSubGrade < 5) {
    // $("#EMB3CourseNum5").html("NA");
    for (let i = 5; i < 9; i++) {
      $("#EMB3CourseNum" + i).html("32");
    }
    $("#EMB3CourseNum9").html("31");
    $("#EMB3CourseNum10").html("30");
    $("#EMB3CourseNum11").html("23");
    $("#EMB3CourseNum12").html("17");
    $("#EMB3CourseNum13").html("8");
    $("#EMB3CourseNum14").html("7");
    $("#EMB3CourseNum15").html("4");
    for (let j = 16; j < 20; j++) {
      $("#EMB3CourseNum" + j).html("0");
    }
  } else {
    // $("#EMB3CourseNum5").html("NA");
    for (let i = 5; i < 20; i++) {
      $("#EMB3CourseNum" + i).html("-");
    }
  }
  console.log("sortedGroupCourseData", sortedGroupCourseData);
  //   console.log("sortedgroupcoursedata", sortedPFPGroupCourseData);
  // console.log("calcScores", calcScores);

  courses["A"] = updateAvailableCourses(
    sortedGroupCourseData["Applied Sciences"],
    calcScores["AppliedSci"]["score"],
    "Applied Sciences"
  );
  courses["B"] = updateAvailableCourses(
    sortedGroupCourseData["Engineering"],
    calcScores["Engineering"]["score"],
    "Engineering"
  );
  courses["C"] = updateAvailableCourses(
    sortedGroupCourseData["Info-Communications Technology"],
    calcScores["InfoCom"]["score"],
    "Info-Communications Technology"
  );
  courses["D"] = updateAvailableCourses(
    sortedGroupCourseData["Business & Services"],
    calcScores["Business"]["score"],
    "Business & Services"
  );
  courses["Group1"] = updateAllPFPCourses(
    sortedPFPGroupCourseData["GROUP 1"],
    calcScores["Group1"]["score"],
    "Group 1"
  );
  courses["Group2"] = updateAllPFPCourses(
    sortedPFPGroupCourseData["GROUP 2"],
    calcScores["Group2"]["score"],
    "Group 2"
  );

  str =
    "<strong>ALWAYS CONFIRM REQUIREMENTS IN " +
    JIELink +
    '</strong><br/><div class="courseGroupAreaTitle">PFP</div>' +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreL1R5">Group I (' +
    calcScores["Group1"]["score"] +
    ") [ " +
    calcScores["Group1"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["Group1"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreL1R4">Group II (' +
    calcScores["Group2"]["score"] +
    ") [ " +
    calcScores["Group2"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["Group2"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupAreaTitle">DPP</div>' +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeA">Applied Sciences (' +
    calcScores["AppliedSci"]["score"] +
    ") [ " +
    calcScores["AppliedSci"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["A"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeB">Engineering (' +
    calcScores["Engineering"]["score"] +
    ") [ " +
    calcScores["Engineering"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["B"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeC">Info-Communications Technology (' +
    calcScores["InfoCom"]["score"] +
    ") [ " +
    calcScores["InfoCom"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["C"]["html"] +
    "</div></div></div>" +
    '<div class="courseGroupArea"><div class="courseGroupTitle scoreTypeD">Business & Services (' +
    calcScores["Business"]["score"] +
    ") [ " +
    calcScores["Business"]["chosenSubjs"].toString().replace(/,/g, ", ") +
    ' ]<div class="courseGroupHide">[ - ]</div></div><div class="courseGroupData">' +
    courses["D"]["html"] +
    "</div></div></div>";

  $(".courseAvailableArea").html(str);

  $(".courseGroupHide").click(toggleGroupArea);

  //console.log(courses);
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

function updateAvailableCourses(dppCourseData, inScore, courseGroup) {
  //let curScore = calcScores["base"];
  let courseList = [];
  let str = "";
  let ret = {
    data: 0,
    html: "",
  };
  let alerts = "";
  let alertsClass;
  // let isPolyFilter = Object.keys(filterPoly).length > 0;
  let actualCount = 0;
  let cutoffDisplay = "";
  let curScore = Number(inScore);
  let bonus = getGrade("BONUS");
  if (bonus === undefined) {
    bonus = 0;
  }
  console.log(curScore);
  if (Number(curScore) + Number(bonus) > dppCutoff + rangeSelection || curScore == "-") {
    // if (curScore > dppCutoff || inScore == "-")

    return ret;
  }

  if (curScore.toString().localeCompare(invalidBaseString) === 0) {
    console.log("true");
    return ret;
  }
  // console.log(dppCourseData);
  /*for (let b in calcScores)
    {
        curScore = calcScores[b];
    }*/

  if (isFiltered) {
    // Only show filtered stuff
    for (let s in filterAll) {
      if (courseNameToDataMap[s] !== undefined) {
        if (courseNameToDataMap[s]["courseGradeType"].localeCompare(courseGroup) === 0) {
          if (
            !isGroupFiltered ||
            curScore - Number(courseNameToDataMap[s]["emb3"]) <= rangeSelection
          ) {
            courseList.push(courseNameToDataMap[s]);
          }
        }
      }
    }
  } else {
    for (let s in dppCourseData) {
      //console.log(curScore, Number(s), curScore - Number(s) <= rangeSelection);
      if (Number(s) === 0 || curScore - Number(s) <= rangeSelection || s === NaN) {
        for (let c in dppCourseData[s]) {
          courseList.push(dppCourseData[s][c]);
          // if (!isPolyFilter || filterPoly[dppCourseData[s][c]["polyName"]] !== undefined)
          // {
          //     courseList.push(dppCourseData[s][c]);
          // }
        }
      }
    }

    //console.log(dppCourseData, courseList);
  }
  // console.log(dppCourseData);
  // console.log("this is courselist", courseList);

  courseList.sort(function (a, b) {
    if (a["emb3"] == "-") {
      return -1;
    }
    if (b["emb3"] == "-") {
      return 1;
    }

    return Number(a["emb3"]) - Number(b["emb3"]);
  });

  // console.log(courseList);

  if (courseList.length > 0) {
    // header row
    str =
      '<div class="row courseGroupRow margin-bottom-0' +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      "Code" +
      '</div><div class="col s2 courseGroupRowPoly">' +
      "ITE" +
      '</div><div class="col s3 courseGroupRowTitle">' +
      "Course Title" +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      "EMB3" +
      '</div><div class="col s3 courseGroupRowMsg">' +
      "Alerts" +
      '</div><div class="col s1 courseGroupRowMsg">' +
      "Conditions" +
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
    cutoffDisplay = c["emb3"];
    if (cutoffDisplay == "0") {
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
      '</div><div class="col s2 courseGroupRowPoly">' +
      c["college"] +
      '</div><div class="col s3 courseGroupRowTitle">' +
      c["courseTitle"] +
      '</div><div class="col s1 courseGroupRowCutoff">' +
      cutoffDisplay +
      '</div><div class="col s3 courseGroupRowMsg">' +
      alerts["text"] +
      '</div><div class="col s1 courseGroupRowTitle">' +
      c["conditions"] +
      "</div></a></div>";
  }

  //console.log(courseList);
  ret["data"] = actualCount;

  //$(".courseAvailableArea").html(str);

  ret["html"] = str;
  return ret;
}

function updateAllPFPCourses(courseData, curScore, courseGroup) {
  let courseList = [];
  let str = "";
  let ret = {
    data: 0,
    html: "",
  };
  //   console.log("this is coursedata", courseData);
  let alerts = "";
  let alertsClass;
  // let isPolyFilter = Object.keys(filterPoly).length > 0;
  let bonus = getGrade("BONUS");
  if (bonus === undefined) {
    bonus = 0;
  }
  let actualCount = 0;
  let cutoffDisplay = "";

  // cutoff of 12 points hard coded
  //   console.log(Number(curScore) + Number(bonus));
  // if (Number(curScore) > pfpCutoff + rangeSelection || curScore == "-") {
  // if (Number(curScore) + Number(bonus) > pfpCutoff + rangeSelection || curScore == "-")
  // return ret;
  // }

  if (curScore.toString().localeCompare(invalidBaseString) === 0) {
    // console.log("we did not come here");
    return ret;
  }

  // if (isFiltered || isPolyFilter)
  // {
  //     return ret;
  // }

  for (let s in courseData) {
    if (courseData[s]["cop"] == "-") {
      courseList.push(courseData[s]);
    } else {
      let cop = Number(courseData[s]["cop"]);
      if (curScore - bonus <= cop) {
        courseList.push(courseData[s]);
      } else if (curScore <= cop + rangeSelection) {
        courseList.push(courseData[s]);
      }
    }
  }

  //   console.log("Update PFP Courses", courseData, curScore, bonus, courseList);

  if (courseList.length > 0) {
    // header row
    str =
      '<div class="row courseGroupRow margin-bottom-0' +
      '">' +
      '<div class="col s1 courseGroupRowCode">' +
      "Code" +
      '</div><div class="col s2 courseGroupRowPoly">' +
      "Poly" +
      '</div><div class="col s5 courseGroupRowTitle">' +
      "Course Title" +
      '</div><div class="col s3 courseGroupRowCutoff">' +
      "Alerts" +
      "</div></div>";
  }

  for (let c of courseList) {
    alerts = getAlertsFromPFPCourse(c, curScore);
    alertsClass = "";
    if (alerts["alerts"] > 0) {
      alertsClass = " courseGroupRowAlert";
    } else {
      actualCount++;
    }
    cutoffDisplay = c["courseCutoff"];
    if (cutoffDisplay == "0") {
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
      '</div><div class="col s2 courseGroupRowPoly">' +
      c["polyName"] +
      '</div><div class="col s5 courseGroupRowTitle">' +
      c["courseName"] +
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
  let gradeEL; // = getGrade("EL");
  let gradeEMath; // = getGrade("EMATH");
  let cutEL = Number(inCourse["ELMinGrade"]); //.substring(1));
  let cutMath = Number(inCourse["mathMinGrade"]); //.substring(1));
  // Minimum grade of 3 subjects that aren't EL or EMath
  let SubsMinGrade = Number(inCourse["3SubMinGrades"]);
  let cutoff = Number(inCourse["emb3"]);
  let ret = {
    alerts: 0,
    text: "",
  };

  if (getGrade("EL") != undefined) {
    gradeEL = getGrade("EL");
  } else if (getGrade("EL(NA)") != undefined) {
    gradeEL = getGrade("EL(NA)");
  }

  if (getGrade("EMATH") != undefined) {
    gradeEMath = getGrade("EMATH");
  } else if (getGrade("EMATH(NA)") != undefined) {
    gradeEMath = getGrade("EMATH(NA)");
  }

  if (cutoff == 0) {
    return ret;
  }

  if (gradeEL !== undefined && gradeEMath !== undefined) {
    if (cutoff !== NaN) {
      if (curScore > cutoff) {
        ret["text"] +=
          "You need to lower your total score by " + (curScore - cutoff) + " point(s)<br/>";
        ret["alerts"] += 1;
      }
    }
    if (gradeEL > cutEL) {
      ret["text"] += "A " + inCourse["ELMinGrade"] + " in EL is required<br/>";
      ret["alerts"] += 1;
    }
    if (gradeEMath > cutMath) {
      ret["text"] += "A " + inCourse["mathMinGrade"] + " in E-Math is required<br/>";
      ret["alerts"] += 1;
    }
    // if (best3Score > SubsMinGrade)
    // {
    //     ret["text"] += "You need to lower your 'best 3' score by " + (best3Score - SubsMinGrade) + " point(s)<br/>";
    //     ret["alerts"] += 1;
    // }
  }

  return ret;
}

function getAlertsFromPFPCourse(inCourse, curScore) {
  let gradeEL; //
  let gradeEMath; //
  let gradeAMath; // = getGrade("AMATH");
  let gradeDNT = getGrade("DNT");
  let gradeSci; //  = getGrade("SCI");
  let gradeHum; // = getGrade("HUM");

  let gradeMT;

  let ret = {
    alerts: 0,
    text: "",
  };

  if (getGrade("MT") != undefined) {
    gradeMT = getGrade("MT");
  } else if (getGrade("MT(NA)") != undefined) {
    gradeMT = getGrade("MT(NA)");
  }

  if (getGrade("EL") != undefined) {
    gradeEL = getGrade("EL");
  } else if (getGrade("EL(NA)") != undefined) {
    gradeEL = getGrade("EL(NA)");
  }

  if (getGrade("EMATH") != undefined) {
    gradeEMath = getGrade("EMATH");
  } else if (getGrade("EMATH(NA)") != undefined) {
    gradeEMath = getGrade("EMATH(NA)");
  }

  if (getGrade("SCI") != undefined) {
    gradeSci = getGrade("SCI");
  } else if (getGrade("SCI(NA)") != undefined) {
    gradeSci = getGrade("SCI(NA)");
  }

  if (getGrade("AMATH") != undefined) {
    gradeAMath = getGrade("AMATH");
  } else if (getGrade("AMATH(NA)") != undefined) {
    gradeAMath = getGrade("AMATH(NA)");
  }

  if (getGrade("HUM") != undefined) {
    gradeHum = getGrade("HUM");
  } else if (getGrade("HUM(NA)") != undefined) {
    gradeHum = getGrade("HUM(NA)");
  }

  // console.log("this is gradehum", gradeHum);
  // console.log("this should fire", inCourse.cop);
  // console.log(curScore);
  if (curScore > inCourse.cop) {
    // if (curScore > pfpCutoff) {
    // console.log("this fire pls ");
    ret["text"] +=
      "You need to lower your score by " + (curScore - inCourse.cop) + " point(s)<br/>";
    ret["alerts"] += 1;
  }
  if (inCourse["courseGroup"] == "GROUP 1") {
    if (gradeEL === undefined || gradeEL > 3) {
      // ret["text"] += "A minimum score of 3 in EL is required<br/>";
      ret["text"] += "A minimum grade of 3(NA) or D7(Exp) is required for English<br/>";
      ret["alerts"] += 1;
    }

    if ((gradeDNT === undefined || gradeDNT > 3) && (gradeSci === undefined || gradeSci > 3)) {
      ret["text"] += "A minimum score of 3(NA) or D7(Exp) in Science or D&T is required<br/>";
      ret["alerts"] += 1;
    }

    if (gradeHum > 4 || gradeMT > 4) {
      // console.log("we fired");
      // console.log(gradeMT);
      ret["text"] += "A minimum score of 4(NA) or E8(Exp) in other subject is required<br/>";
      ret["alerts"] += 1;
    }
  } else if (inCourse["courseGroup"] == "GROUP 2") {
    if (gradeEL === undefined || gradeEL > 2) {
      // ret["text"] += "A minimum core of 2 in EL is required<br/>";
      ret["text"] += "A minimum grade of 2(NA) or C6(Exp) in EL is required.";
      ret["alerts"] += 1;
    }

    if ((gradeDNT === undefined || gradeDNT > 3) && (gradeHum === undefined || gradeHum > 3)) {
      ret["text"] += "A minimum score of 3(NA) or D7(Exp) in Humanities or D&T is required<br/>";
      ret["alerts"] += 1;
    }
    if (gradeSci > 4 || gradeMT > 4) {
      // console.log("we fired");
      // console.log(gradeMT);
      ret["text"] += "A minimum score of 4(NA) or E8(Exp) in other subject is required<br/>";
      ret["alerts"] += 1;
    }
  }
  if (
    !((gradeEMath !== undefined && gradeEMath < 4) || (gradeAMath !== undefined && gradeAMath < 4))
  ) {
    ret["text"] += "A minimum score of 3(NA) or D7(Exp) in E-Math / A-Math is required<br/>";
    ret["alerts"] += 1;
  }

  return ret;
}

function calculateEMB3(type, group1or2) {
  let checkPasses = false;
  let count = countSubjects();
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

  if (count < minSubjs) {
    return scoreData;
  }

  let baseEL; // = getGrade("EL");
  let baseEMath; // = getGrade("HMT");
  let bonus = getGrade("BONUS");
  let useBonus = false;
  let selectedGroups = [];

  let basePool = createGradePool();
  //   console.log(basePool);

  if (getGrade("EL") === undefined && getGrade("EL(NA)") === undefined) {
    return scoreData;
  } else if (getGrade("EL") != undefined) {
    // selectedGroups.push(["EL"]);
    baseEL = getGrade("EL");
  } else if (getGrade("EL(NA)") != undefined) {
    // selectedGroups.push(["EL(NA)"]);
    baseEL = getGrade("EL(NA)");
  }

  if (getGrade("EMATH") === undefined && getGrade("EMATH(NA)") === undefined) {
    return scoreData;
  } else if (getGrade("EMATH") != undefined) {
    // selectedGroups.push(["EMATH"]);
    baseEMath = getGrade("EMATH");
  } else if (getGrade("EMATH(NA)") != undefined) {
    // selectedGroups.push(["EMATH(NA)"]);
    baseEMath = getGrade("EMATH(NA)");
  }

  // for (let n in grades)
  // {
  //     // console.log(n);
  //     if (n != 'EL' && n != 'EL(NA)'  && n != 'EMATH' && n != 'EMATH(NA)' && getGrade(n) != undefined){
  //         selectedGroups.push([n]);
  //     }
  // }

  // Add All subjects for Best 3 of EMB3
  // selectedGroups.push(["ALL"]);
  // // R2
  // selectedGroups.push(["ALL"]);
  // // R3
  // selectedGroups.push(["ALL"]);

  switch (type) {
    // For PFP courses
    case 0:
      // R1
      // if(document.getElementById("gradeEL").options[document.getElementById("gradeEL").selectedIndex].text != 'E8')
      selectedGroups.push(["ALL"]);
      // R2
      selectedGroups.push(["ALL"]);
      // R3
      selectedGroups.push(["ALL"]);
      checkPasses = true;
      break;
    // Add All subjects for Best 3 of EMB3
    case 1:
      // R1
      selectedGroups.push(["ALL"]);
      // R2
      selectedGroups.push(["ALL"]);
      // R3
      selectedGroups.push(["ALL"]);
      checkPasses = false;
      useBonus = true;
      break;
  }

  //   console.log(selectedGroups);

  //console.log("EL", basePool, selectedGroups);

  scoreData = getScoreFromGroups(basePool, selectedGroups);
  if (!checkPasses) {
    if (scoreData["score"] !== -1) {
      scoreData["score"] = Number(baseEL) + Number(baseEMath) + scoreData["score"];
      if (getGrade("EL") != undefined) {
        scoreData["chosenSubjs"].unshift("EL");
      } else if (getGrade("EL(NA)") != undefined) {
        scoreData["chosenSubjs"].unshift("EL(NA)");
      }

      if (getGrade("EMATH") != undefined) {
        scoreData["chosenSubjs"].unshift("EMATH");
      } else if (getGrade("EMATH(NA)") != undefined) {
        scoreData["chosenSubjs"].unshift("EMATH(NA)");
      }
    }
  }
  // console.log(basePool);
  // console.log(scoreData);

  if (checkPasses) {
    basePool = createGradePool(1);
    // console.log("this is basepool", basePool);
    scoreData = getScoreFromGroups(basePool, selectedGroups);
    // console.log("this is scoreData", scoreData);
    if (scoreData["score"] !== -1) {
      // var text= $('#gradeEL').text();
      // var e = document.getElementById("gradeEL").options[document.getElementById("gradeEL").selectedIndex].text;
      // if (document.getElementById("gradeEL").options[document.getElementById("gradeEL").selectedIndex].text == 'E8' ||)

      if (
        getGrade("EL") != undefined &&
        document.getElementById("gradeEL").options[document.getElementById("gradeEL").selectedIndex]
          .text != "E8"
      ) {
        scoreData["score"] = Number(baseEL) + scoreData["score"];
        scoreData["chosenSubjs"].unshift("EL");
      } else if (
        getGrade("EL(NA)") != undefined &&
        document.getElementById("gradeELNA").options[
          document.getElementById("gradeELNA").selectedIndex
        ].text != "E8"
      ) {
        scoreData["score"] = Number(baseEL) + scoreData["score"];
        scoreData["chosenSubjs"].unshift("EL(NA)");
      }

      if (
        getGrade("EMATH") != undefined &&
        document.getElementById("gradeEMath").options[
          document.getElementById("gradeEMath").selectedIndex
        ].text != "E8"
      ) {
        scoreData["score"] = Number(baseEMath) + scoreData["score"];
        scoreData["chosenSubjs"].unshift("EMATH");
      } else if (
        getGrade("EMATH(NA)") != undefined &&
        document.getElementById("gradeEMathNA").options[
          document.getElementById("gradeEMathNA").selectedIndex
        ].text != "E8"
      ) {
        scoreData["score"] = Number(baseEMath) + scoreData["score"];
        scoreData["chosenSubjs"].unshift("EMATH(NA)");
      }
    }
  }

  //jason written
  // let naEngGrade =
  //   document.getElementById("gradeELNA").options[document.getElementById("gradeELNA").selectedIndex]
  //     .value;
  // let expEngGrade =
  //   document.getElementById("gradeEL").options[document.getElementById("gradeEL").selectedIndex]
  //     .value;

  // let naEmath =
  //   document.getElementById("gradeEMathNA").options[
  //     document.getElementById("gradeEMathNA").selectedIndex
  //   ].value;
  // let expEmath =
  //   document.getElementById("gradeEMath").options[
  //     document.getElementById("gradeEMath").selectedIndex
  //   ].value;

  // let naSci =
  //   document.getElementById("gradeSciNA").options[
  //     document.getElementById("gradeSciNA").selectedIndex
  //   ].value;
  // let expSci =
  //   document.getElementById("gradeSci").options[document.getElementById("gradeSci").selectedIndex]
  //     .value;

  // let dnt =
  //   document.getElementById("gradeDNT").options[document.getElementById("gradeDNT").selectedIndex]
  //     .value;

  // let naHum =
  //   document.getElementById("gradeHumNA").options[
  //     document.getElementById("gradeHumNA").selectedIndex
  //   ].value;
  // let expHum =
  //   document.getElementById("gradeHum").options[document.getElementById("gradeHum").selectedIndex]
  //     .value;

  // if (group1or2 == 1) {
  //   let selectedValues = $(
  //     ".subjGrade select:not(#gradeELNA,#gradeEL,#gradeEMathNA,#gradeEMath,#gradeSciNA,#gradeSci,#gradeDNT)"
  //   )
  //     .filter(function () {
  //       return $(this).find(":selected").text().trim() !== ""; // Filters out elements with no selected text
  //     })
  //     .map(function () {
  //       return $(this).val();
  //     })
  //     .get();

  //   selectedValues.forEach((ele) => {
  //     if (ele > 4) {
  //       scoreData["score"] = -1;
  //     }
  //   });
  //   console.log(selectedValues);

  //   if (
  //     naEngGrade > 3 ||
  //     expEngGrade > 3 ||
  //     naEmath > 3 ||
  //     expEmath > 3 ||
  //     naSci > 3 ||
  //     expSci > 3 ||
  //     dnt > 3
  //   ) {
  //     scoreData["score"] = -1; // set the score of the user to max and disqualify the user
  //   }
  // } else if (group1or2 == 2) {
  //   let selectedValues = $(
  //     ".subjGrade select:not(#gradeELNA,#gradeEL,#gradeEMathNA,#gradeEMath,#gradeHumNA,#gradeHum)"
  //   )
  //     .filter(function () {
  //       return $(this).find(":selected").text().trim() !== ""; // Filters out elements with no selected text
  //     })
  //     .map(function () {
  //       return $(this).val();
  //     })
  //     .get();

  //   selectedValues.forEach((ele) => {
  //     if (ele > 4) {
  //       scoreData["score"] = -1;
  //     }
  //   });
  //   console.log(selectedValues);
  //   if (
  //     naEngGrade > 2 ||
  //     expEngGrade > 2 ||
  //     naEmath > 3 ||
  //     expEmath > 3 ||
  //     naSci > 3 ||
  //     expSci > 3 ||
  //     expHum > 3 ||
  //     naHum > 3
  //   ) {
  //     scoreData["score"] = -1; // set the score of the user to max and disqualify the user
  //   }
  // }

  // // to check for any subject more than grade 4 and above
  // if (group1or2) {
  // }

  if (tmpScoreData["score"] === -1) {
    tmpScoreData = scoreData;
  }

  let ret = Number(scoreData["score"]) > Number(tmpScoreData["score"]) ? tmpScoreData : scoreData;

  if (useBonus && bonus !== undefined) {
    ret["score"] -= bonus;
  }
  $("#emb3-score").text(ret["score"]);
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
  // console.log("score check", basePool);

  for (let g of selectedGroups) {
    // grps = selectedGroups;
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
    // console.log(chosen);
    chosen.sort(function (a, b) {
      return Number(a["score"]) - Number(b["score"]);
    });

    if (chosen.length == 0) {
      return ret;
    }

    score += Number(basePool[chosen[0]["subj"]].shift()["grade"]);

    scoreSubjs.push(chosen[0]["subjName"]);
    // console.log(arrStore);
  }
  best3Score = score;

  ret["score"] = score;
  ret["chosenSubjs"] = scoreSubjs;
  // console.log(ret);
  return ret;
}

// Adds all grades to pool except for Bonus
function createGradePool(baseType = 0) {
  let ret = {};
  let ignored = {
    EL: 1,
    "EL(NA)": 1,
    EMATH: 1,
    "EMATH(NA)": 1,
    BONUS: 1,
  };

  if (baseType === 1) {
    if (
      document.getElementById("gradeMTNA").options[
        document.getElementById("gradeMTNA").selectedIndex
      ].text == "E8"
    ) {
      ignored["MT(NA)"] = 1;
    }
    if (
      document.getElementById("gradeMT").options[document.getElementById("gradeMT").selectedIndex]
        .text == "E8"
    ) {
      ignored["MT"] = 1;
    }
    if (
      document.getElementById("gradeHum").options[document.getElementById("gradeHum").selectedIndex]
        .text == "E8"
    ) {
      ignored["HUM"] = 1;
    }
    if (
      document.getElementById("gradeHumNA").options[
        document.getElementById("gradeHumNA").selectedIndex
      ].text == "E8"
    ) {
      ignored["HUM(NA)"] = 1;
    }
    if (
      document.getElementById("gradeSciNA").options[
        document.getElementById("gradeSciNA").selectedIndex
      ].text == "E8"
    ) {
      ignored["SCI(NA)"] = 1;
    }
    if (
      document.getElementById("gradeSci").options[document.getElementById("gradeSci").selectedIndex]
        .text == "E8"
    ) {
      console.log(
        document.getElementById("gradeSci").options[
          document.getElementById("gradeSci").selectedIndex
        ].text
      );
      ignored["SCI"] = 1;
    }
    if (
      document.getElementById("gradeAMath").options[
        document.getElementById("gradeAMath").selectedIndex
      ].text == "E8"
    ) {
      ignored["AMATH"] = 1;
    }
    if (
      document.getElementById("gradeAMathNA").options[
        document.getElementById("gradeAMathNA").selectedIndex
      ].text == "E8"
    ) {
      ignored["AMATH(NA)"] = 1;
    }
    if (
      document.getElementById("gradeDNT").options[document.getElementById("gradeDNT").selectedIndex]
        .text == "E8"
    ) {
      ignored["DNT"] = 1;
    }
  }

  for (let n in grades) {
    // if (ret[n] === undefined) {
    //     ret[n] = {};
    // }
    // console.log(grades[n]["data"]);
    if (ignored[n] === undefined) {
      ret[n] = Array.from(grades[n]["data"]);
    }
    /*else
        {
            console.log("Ignored");
        }*/
  }
  //console.log("Type: ", baseType, Array.from(ret));

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
  let ret = "";

  for (let v of arr) {
    ret += v + " ";
  }

  return ret.trim();
}

// function modelMatcher (params, data)
// {
// 	data.parentText = data.parentText || "";

// 	// Always return the object if there is nothing to compare
// 	if ($.trim(params.term) === '') {
// 		return data;
// 	}

// 	// Do a recursive check for options with children
// 	if (data.children && data.children.length > 0) {
// 		// Clone the data object if there are children
// 		// This is required as we modify the object to remove any non-matches
// 		var match = $.extend(true, {}, data);
// 		//console.log(data);

// 		// Check each child of the option
// 		for (var c = data.children.length - 1; c >= 0; c--) {
// 			var child = data.children[c];
// 			child.parentText += data.parentText + " " + data.text;

// 			var matches = modelMatcher(params, child);

// 			// If there wasn't a match, remove the object in the array
// 			if (matches == null) {
// 				match.children.splice(c, 1);
// 			}
// 		}

// 		// If any children matched, return the new object
// 		if (match.children.length > 0) {
// 			return match;
// 		}

// 		// If there were no matching children, check just the plain object
// 		return modelMatcher(params, match);
// 	}

// 	// If the typed-in term matches the text of this term, or the text from any
// 	// parent term, then it's a match.
// 	var original = (data.parentText + ' ' + data.text).toUpperCase();
// 	var term = params.term.toUpperCase();

// 	let split = term.split(" ");

// 	// Check if the text contains the term
// 	for (let t of split)
// 	{
// 		if (t.length > 0)
// 		{
// 			if (original.indexOf(t) == -1) {
// 				return null;
// 			}
// 		}
// 	}

// 	// If it doesn't contain the term, don't return anything
// 	return data;
// }
