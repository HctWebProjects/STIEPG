let grades = {};

let rawCourseData;

let sortedCourseData = {};
let sortedGroupCourseData = {};
let courseNameToDataMap = {};
let courseGroupToCourseMap = {};
let courseITEToCourseMap = {};

// let filterAll = {};
// let filterGroup = {};
// let filterName = {};
// let filterPoly = {};

let isFiltered = false;
let isGroupFiltered = false;
let invalidBaseString = "-";

let jcCutoff = 20;
let polyCutoff = 26;
let passCount;
let rangeSelection = 2;

$(document).ready(function() {
    $("select").formSelect();

    $(".subjGrade").on("change", updateView);

    $("#ELNA").click(function(e){
        $('#gradeELNA').prop('disabled', false);
        $('#gradeEL').prop('disabled', true);
        $('#gradeEL').prop('value', -1);
    });

    $("#gradeELNA").on("change", function(e){
        $('#gradeELNA').prop('disabled', false);
        $('#gradeEL').prop('disabled', true);
        $('#gradeEL').prop('value', -1);
        $("#ELNA").prop("checked", true);
    });

    $("#ELNT").click(function(e){
        $('#gradeEL').prop('disabled', false);
        $('#gradeELNA').prop('disabled', true);
        $('#gradeELNA').prop('value', -1);
    });

    $("#gradeEL").on("change", function(e){
        $('#gradeEL').prop('disabled', false);
        $('#gradeELNA').prop('disabled', true);
        $('#gradeELNA').prop('value', -1);
        $("#ELNT").prop("checked", true);
    });

    $("#MTNA").click(function(e){
        $('#gradeMTNA').prop('disabled', false);
        $('#gradeMT').prop('disabled', true);
        $('#gradeMT').prop('value', -1);
    });

    $("#gradeMTNA").on("change", function(e){
        $('#gradeMTNA').prop('disabled', false);
        $('#gradeMT').prop('disabled', true);
        $('#gradeMT').prop('value', -1);
        $("#MTNA").prop("checked", true);        
    });

    $("#MTNT").click(function(e){
        $('#gradeMT').prop('disabled', false);
        $('#gradeMTNA').prop('disabled', true);
        $('#gradeMTNA').prop('value', -1);        
    });

    $("#gradeMT").on("change", function(e){
        $('#gradeMT').prop('disabled', false);
        $('#gradeMTNA').prop('disabled', true);
        $('#gradeMTNA').prop('value', -1);    
        $("#MTNT").prop("checked", true);    
    });

    $("#SciNA").click(function(e){
        $('#gradeSciNA').prop('disabled', false);
        $('#gradeSci').prop('disabled', true);
        $('#gradeSci').prop('value', -1);
    });

    $("#gradeSciNA").on("change", function(e){
        $('#gradeSciNA').prop('disabled', false);
        $('#gradeSci').prop('disabled', true);
        $('#gradeSci').prop('value', -1);
        $("#SciNA").prop("checked", true);    
    });

    $("#SciNT").click(function(e){
        $('#gradeSciNA').prop('disabled', true);
        $('#gradeSci').prop('disabled', false);
        $('#gradeSciNA').prop('value', -1);
    });

    $("#gradeSci").on("change", function(e){
        $('#gradeSciNA').prop('disabled', true);
        $('#gradeSci').prop('disabled', false);
        $('#gradeSciNA').prop('value', -1);
        $("#SciNT").prop("checked", true); 
    });

    $("#EMathNA").click(function(e){
        $('#gradeEMath').prop('disabled', true);
        $('#gradeEMathNA').prop('disabled', false);
        $('#gradeEMath').prop('value', -1);
    });

    $("#gradeEMathNA").on("change", function(e){
        $('#gradeEMath').prop('disabled', true);
        $('#gradeEMathNA').prop('disabled', false);
        $('#gradeEMath').prop('value', -1);
        $("#EMathNA").prop("checked", true); 
    });

    $("#EMathNT").click(function(e){
        $('#gradeEMath').prop('disabled', false);
        $('#gradeEMathNA').prop('disabled', true);
        $('#gradeEMathNA').prop('value', -1);
    });

    $("#gradeEMath").on("change", function(e){
        $('#gradeEMath').prop('disabled', false);
        $('#gradeEMathNA').prop('disabled', true);
        $('#gradeEMathNA').prop('value', -1);
        $("#EMathNT").prop("checked", true); 
    });

    $("#infoButton").click(function(e) {
        if ($(".disclaimerArea").hasClass("disclaimerAreaShow"))
        {
            $(".disclaimerArea").removeClass("disclaimerAreaShow")
        }
        else
        {
            $(".disclaimerArea").addClass("disclaimerAreaShow")
        }
    });

    $(".disclaimerArea").click(function(e) {
        $(".disclaimerArea").removeClass("disclaimerAreaShow")
    });

    $("#conditionsButton").click(function(e) {
        if ($(".conditionsArea").hasClass("conditionsAreaShow"))
        {
            $(".conditionsArea").removeClass("conditionsAreaShow")
        }
        else
        {
            $(".conditionsArea").addClass("conditionsAreaShow")
        }
    });

    $(".conditionsArea").click(function(e) {
        $(".conditionsArea").removeClass("conditionsAreaShow")
    });

    $("#excelButton").click(function (e) {
        if ($(".excelArea").hasClass("excelAreaShow")) {
            $(".excelArea").removeClass("excelAreaShow")
        }
        else {
            $(".excelArea").addClass("excelAreaShow")
            $(".disclaimerArea").removeClass("disclaimerAreaShow")
            $(".conditionsArea").removeClass("conditionsAreaShow")
        }
    });

    $(".excelArea").click(function (e) {
        $(".excelArea").removeClass("excelAreaShow")
    });

    $("#scoreRange").on("change", function(e) {
        rangeSelection = $("#scoreRange").val();
        updateView(e);
    });

    initialiseGrades();

    rawCourseData = NTCourseData;
    // rawCourseData = JSON.parse(NTCourseData);
    // console.log(rawCourseData);

    parseRawCourseData();
    // initialiseSelect2();

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


function parseRawCourseData()
{
    let score = 0;
    let group = "";
    let name = "";
    let clusters = "";
    let college = "";

    for (let d of rawCourseData)
    {
        score = d["aggregate"];
        group = d["courseGradeType"];
        name = getCourseNameFromCourseData(d);
        clusters = d["courseCluster"];
        college = d["college"];

        if (score === "-")
        {
            score = 0;
        }
        else
        {
            score = Number(score);
        }

        if (sortedCourseData[score] === undefined)
        {
            sortedCourseData[score] = [];
        }

        sortedCourseData[score].push(d);

        if (sortedGroupCourseData[group] === undefined)
        {
            sortedGroupCourseData[group] = {};
        }
        if (sortedGroupCourseData[group][score] === undefined)
        {
            sortedGroupCourseData[group][score] = [];
        }

        sortedGroupCourseData[group][score].push(d);

        courseNameToDataMap[name] = d;
        if (courseGroupToCourseMap[clusters] === undefined)
        {
            courseGroupToCourseMap[clusters] = {};
        }
        courseGroupToCourseMap[clusters][name] = d;

        if (courseITEToCourseMap[college] === undefined)
        {
            courseITEToCourseMap[college] = {};
        }
        courseITEToCourseMap[college][name] = d;
    }
}

function getCourseNameFromCourseData(inCourse)
{
    return inCourse["courseCode"] + " (" + inCourse["college"] + ") " + inCourse["courseTitle"];
}

function initialiseGrades()
{
    grades["EL"] = getGradeStruct("gradeEL");
    grades["EL(NA)"] = getGradeStruct("gradeELNA");
    grades["MT"] = getGradeStruct("gradeMT");
    grades["MT(NA)"] = getGradeStruct("gradeMTNA");
    grades["SCI"] = getGradeStruct("gradeSci");
    grades["SCI(NA)"] = getGradeStruct("gradeSciNA");
    grades["EMATH"] = getGradeStruct("gradeEMath");
    grades["EMATH(NA)"] = getGradeStruct("gradeEMathNA");
    grades["CPA"] = getGradeStruct("gradeCPA");
    grades["EBS"] = getGradeStruct("gradeEBS");
    grades["BONUS"] = getGradeStruct("gradeBonus");
}

function getGradeStruct(id, count = 1)
{
    return {
        id: id,
        maxCount: count,
        data: [],
    };
}

function updateView(e)
{
    var strJIE = "JIE BOOKLET";
    var JIELink = strJIE.link("https://www.ite.edu.sg/docs/default-source/admissions-docs/full-time/publications/admission-booklet/gce-n-admission-booklet-2020.pdf"); 
    updateGrades();
    let calcScores = {};

    calcScores["MaScB3"] = calculateAgg(0);
    calcScores["ELB3"] = calculateAgg(1);
    calcScores["MAB3"] = calculateAgg(2);
    calcScores["B4"] = calculateAgg(3);
    calcScores["ELMAB2"] = calculateAgg(4);


    let courseSize = {};
    let courses = {};

    let str = "";

    for (let n in calcScores)
    {
        if (calcScores[n]["score"] == -1)
        {
            calcScores[n]["score"] = invalidBaseString;
        }
    }

    
    // $("#scoreL1R4Base").html(calcScores["base"]["score"]);
    $("#scoreL1R5").html(calcScores["MaScB3"]["score"] || 0);
    $("#scoreL1R4A").html(calcScores["ELB3"]["score"] || 0);
    $("#scoreL1R4B").html(calcScores["MAB3"]["score"] || 0);
    $("#scoreL1R4C").html(calcScores["B4"]["score"] || 0);
    $("#scoreL1R4D").html(calcScores["ELMAB2"]["score"] || 0);

    courses["A"] = updateAvailableCourses(sortedGroupCourseData["MaScB3"], calcScores["MaScB3"]["score"], "A");
    courses["B"] = updateAvailableCourses(sortedGroupCourseData["ELB3"], calcScores["ELB3"]["score"], "B");
    courses["C"] = updateAvailableCourses(sortedGroupCourseData["MAB3"], calcScores["MAB3"]["score"], "C");
    courses["D"] = updateAvailableCourses(sortedGroupCourseData["B4"], calcScores["B4"]["score"], "D");
    courses["E"] = updateAvailableCourses(sortedGroupCourseData["ELMAB2"], calcScores["ELMAB2"]["score"], "D");

    // $("#scoreL1R4BaseCourseNum").html(courses["MI"]["data"]);
    $("#scoreL1R5CourseNum").html(courses["A"]["data"]);
    $("#scoreL1R4ACourseNum").html(courses["B"]["data"]);
    $("#scoreL1R4BCourseNum").html(courses["C"]["data"]);
    $("#scoreL1R4CCourseNum").html(courses["D"]["data"]);
    $("#scoreL1R4DCourseNum").html(courses["E"]["data"]);


    str = "<strong>ALWAYS CONFIRM REQUIREMENTS IN " + JIELink + "</strong><br/><div class=\"courseGroupAreaTitle\">ITE Courses</div>"
        // + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreL1R5\">Ma/Sc B3 (" + calcScores["L1R5"]["score"] + ") [ "
        // + calcScores["L1R5"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        // + courses["JC"]["html"] + "</div></div></div>"
        
        + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreL1R5\">Ma/Sc B3 (" + (calcScores["MaScB3"]["score"] || 0 ) + ") [ "
        + calcScores["MaScB3"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        + courses["A"]["html"] + "</div></div></div>"
        
        + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreTypeA\">ELB3 (" + (calcScores["ELB3"]["score"] || 0 ) + ") [ "
        + calcScores["ELB3"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        + courses["B"]["html"] + "</div></div></div>"
        
        + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreTypeB\">MAB3 (" + (calcScores["MAB3"]["score"] || 0 ) + ") [ "
        + calcScores["MAB3"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        + courses["C"]["html"] + "</div></div></div>"
        
        + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreTypeC\">B4 (" + (calcScores["B4"]["score"] || 0 ) + ") [ "
        + calcScores["B4"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        + courses["D"]["html"] + "</div></div></div>"
        
        + "<div class=\"courseGroupArea\"><div class=\"courseGroupTitle scoreTypeD\">ELMAB2 (" + (calcScores["ELMAB2"]["score"] || 0 ) + ") [ "
        + calcScores["ELMAB2"]["chosenSubjs"].toString().replace(/,/g, ", ") + " ]<div class=\"courseGroupHide\">[ - ]</div></div><div class=\"courseGroupData\">"
        + courses["E"]["html"] + "</div></div></div>";

    $(".courseAvailableArea").html(str);

    $(".courseGroupHide").click(toggleGroupArea);

    //console.log(courses);
}

function toggleGroupArea(e)
{
    let targ = $(e.target);
    if (!targ.hasClass("courseGroupArea"))
    {
        targ = targ.parents(".courseGroupArea");
    }

    if (targ.hasClass("courseGroupHidden"))
    {
        targ.removeClass("courseGroupHidden");
        $(e.target).html("[ - ]");
    }
    else
    {
        targ.addClass("courseGroupHidden");
        $(e.target).html("[ + ]");
    }
}

function updateAvailableCourses(courseData, inScore, courseGroup)
{
    //let curScore = calcScores["base"];
    // console.log("courseData",courseData);
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

    if (curScore > jcCutoff || inScore == "-")
    {
        return ret;
    }

    if (curScore.toString().localeCompare(invalidBaseString) === 0)
    {
        return ret;
    }

    /*for (let b in calcScores)
    {
        curScore = calcScores[b];
    }*/

    // if (isFiltered)
    // {
    //     // Only show filtered stuff
    //     for (let s in filterAll)
    //     {
    //         if (courseNameToDataMap[s] !== undefined)
    //         {
    //             if (courseNameToDataMap[s]["courseGradeType"].localeCompare(courseGroup) === 0)
    //             {
    //                 if (!isGroupFiltered || curScore - Number(courseNameToDataMap[s]["aggregate"]) <= rangeSelection)
    //                 {
    //                     courseList.push(courseNameToDataMap[s]);
    //                 }
    //             }
    //         }
    //     }
    // }
    // else
    // {
        for (let s in courseData)
        {
            //console.log(curScore, Number(s), curScore - Number(s) <= rangeSelection);
            if (Number(s) === 0 || (curScore - Number(s) <= rangeSelection ))
            {
                for (let c in courseData[s])
                {
                    courseList.push(courseData[s][c]);
                    // if (!isPolyFilter || filterPoly[courseData[s][c]["polyName"]] !== undefined)
                    // {
                    //     courseList.push(courseData[s][c]);
                    // }
                }
            }
        }

        //console.log(courseData, courseList);
    // }

    courseList.sort(function (a, b) {
        if (a["aggregate"] == "-")
        {
            return -1;
        }
        if (b["aggregate"] == "-")
        {
            return 1;
        }

        return Number(a["aggregate"]) - Number(b["aggregate"]);
    });

    if (courseList.length > 0)
    {
        // header row
        str = "<div class=\"row courseGroupRow margin-bottom-0" + "\">"
        + "<div class=\"col s1 courseGroupRowCode\">" + "Code" + "</div><div class=\"col s2 courseGroupRowPoly\">"
        + "ITE" + "</div><div class=\"col s3 courseGroupRowTitle\">" + "Course Title"
        + "</div><div class=\"col s1 courseGroupRowCutoff\">" + "Cutoff" + "</div><div class=\"col s3 courseGroupRowMsg\">"
        + "Alerts" 
        + "</div><div class=\"col s2 courseGroupRowMsg\">"
        + "Conditions" 
        + "</div></div>";
    }

    for (let c of courseList)
    {
        alerts = getAlertsFromCourse(c, curScore);
        alertsClass = "";
        if (alerts["alerts"] > 0)
        {
            alertsClass = " courseGroupRowAlert";
        }
        else
        {
            actualCount++;
        }
        cutoffDisplay = c["aggregate"];
        if (cutoffDisplay == "-")
        {
            cutoffDisplay = "NEW";
        }

        str += "<div class=\"row courseGroupRow margin-bottom-0" + alertsClass + "\"><a target=\"_blank\" href=\"" + c["courseURL"] + "\">"
            + "<div class=\"col s1 courseGroupRowCode\">" + c["courseCode"] + "</div><div class=\"col s2 courseGroupRowPoly\">"
            + c["college"] + "</div><div class=\"col s3 courseGroupRowTitle\">" + c["courseTitle"]
            + "</div><div class=\"col s1 courseGroupRowCutoff\">" + cutoffDisplay +"</div><div class=\"col s3 courseGroupRowMsg\">"
            + alerts["text"] 
            + "</div><div class=\"col s2 courseGroupRowTitle\">" 
            + c["conditions"]
            + "</div></a></div>";
    }

    //console.log(courseList);
    ret["data"] = actualCount;

    //$(".courseAvailableArea").html(str);

    ret["html"] = str;

    return ret;
}

function updateGrades()
{
    let tmpGrade;
    let id;
    for (let n in grades)
    {
        grades[n]["data"] = [];
        for (let i = 0; i < grades[n]["maxCount"]; i++)
        {
            id = grades[n]["id"];
            if (grades[n]["maxCount"] > 1)
            {
                id += "" + (i + 1);
            }
            
            tmpGrade = $("#" + id).val();

            //console.log(id, $("#" + id), "grade: " + tmpGrade);
            if (tmpGrade != undefined && tmpGrade != -1)
            {
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
    countPasses(grades)
    // console.log(grades);
}

function countPasses(grades)
{
    let data;
    let gradeArr = []
    for (n in grades)
    {
        data = grades[n]["data"];
        if (!(grades[n]["data"] == undefined || grades[n]["data"].length < 1))
        {
            gradeArr.push(data[0]["grade"]);
        }   
    }

    // console.log(gradeArr);
    // var map = gradeArr.reduce(function(obj, b) {
    //     obj[b] = ++obj[b] || 1;
    //     return obj;
    //   }, {});
    passCount = gradeArr.reduce((n, x) => n + (x === "5"), 0);
    passCount = gradeArr.length - passCount;
    
}

function getAlertsFromCourse(inCourse, curScore)
{
    let gradeEL; // = getGrade("EL");
    let gradeEMath; // = getGrade("EMATH");
    let gradeSci;
    let cutEL = 4;//Number(inCourse["courseGradeEL"].substring(1));
    let cutMath = 4; //Number(inCourse["courseGradeMaths"].substring(1));
    let cutoff = Number(inCourse["aggregate"]);
    let noOfPasses = Number(inCourse["nLevelPasses"]);
    let gradeType = inCourse["courseGradeType"];
    let ret = {
        alerts: 0,
        text: "",
    };

    if (getGrade("EL") != undefined) 
    {
        gradeEL = getGrade("EL");
    }
    else if(getGrade("EL(NA)") != undefined)
    {
        gradeEL = getGrade("EL(NA)");
    }

    if (getGrade("EMATH") != undefined) 
    {
        gradeEMath = getGrade("EMATH");
    }
    else if(getGrade("EMATH(NA)") != undefined)
    {
        gradeEMath = getGrade("EMATH(NA)");
    }

    if (getGrade("SCI") != undefined) 
    {
        gradeSci = getGrade("SCI");
    }
    else if(getGrade("SCI(NA)") != undefined)
    {
        gradeSci = getGrade("SCI(NA)");
    }

    // console.log(inCourse);
    // if (gradeEL !== undefined && gradeEMath !== undefined)
    // {
        //console.log(cutEL, cutMath, cutoff);

        if (cutoff !== NaN)
        {
            if (curScore > cutoff)
            {
                ret["text"] += "You need to lower your score by " + (curScore - cutoff) + " point(s)<br/>";
                ret["alerts"] += 1;
            }
        }

        // console.log(gradeType);
        if (gradeType === "MaScB3")
        {
            if (gradeSci > 4 && gradeEMath > 4) 
            {
                ret["text"] += "A pass in Maths or Science is required<br/>";
                ret["alerts"] += 1;
            }
        }
        else if (gradeType === "ELB3")
        {
            if (gradeEL > 4) 
            {
                ret["text"] += "A pass in EL is required<br/>";
                ret["alerts"] += 1;
            }
        }
        else if (gradeType === "MAB3")
        {
            if (gradeEMath > 4) 
            {
                ret["text"] += "A pass in Maths is required<br/>";
                ret["alerts"] += 1;
            }
        }
        else if (gradeType === "B4")
        {

        }
        else if (gradeType === "ELMAB2")
        {
            if (gradeEL > 4 || gradeEMath > 4) 
            {
                ret["text"] += "A pass in both EL & Maths is required<br/>";
                ret["alerts"] += 1;
            }
        }

        if(passCount < noOfPasses)
        {
            ret["text"] += "At least " + inCourse["nLevelPasses"] + " passes are required<br/>";
            ret["alerts"] += 1;
        }
    // }

    return ret;
}

function calculateAgg(type)
{
    let count = countSubjects();
    let minSubjs = 4;

    let scoreData = {
        score: -1,
        chosenSubjs: [],
    };
    let score = -1;
    let tmpScoreData = {
        score: -1,
        chosenSubjs: [],
    };
    let tmpScore = -1;
    let useEL;
    let useMath;
    let useMathSci;
    let useELMath;

    if (count < minSubjs)
    {
        return scoreData;
    }

    // if (getGrade("EL") === undefined)
    // {
    //     return scoreData;
    // }

    let baseEL; 
    let baseEMath;
    let baseSci; 
    let caseEL, caseSci, caseEMath; 
    let bonus = getGrade("BONUS");
    let useBonus = false;

    let basePool = createGradePool();
    // console.log(basePool);
    let selectedGroups = [];

    if (getGrade("EL") != undefined) 
    {
        baseEL = getGrade("EL");
        caseEL = 1;
    }
    else if(getGrade("EL(NA)") != undefined)
    {
        baseEL = getGrade("EL(NA)");
        caseEL = 2;
    }

    if (getGrade("EMATH") != undefined) 
    {
        baseEMath = getGrade("EMATH");
        caseEMath = 1;
    }
    else if(getGrade("EMATH(NA)") != undefined)
    {
        baseEMath = getGrade("EMATH(NA)");
        caseEMath = 2;
    }

    if (getGrade("SCI") != undefined) 
    {
        baseSci = getGrade("SCI");
        caseSci = 1;
    }
    else if(getGrade("SCI(NA)") != undefined)
    {
        baseSci = getGrade("SCI(NA)");
        caseSci = 2;
    }


    switch (type)
    {
        // MA/SC B3
        case 0:
            // R1
            selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI"]);
            // R2
            // selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "EL", "EL(NA)", "MT", "MT(NA)", "CPA", "EBS"]);
            selectedGroups.push(["ALL"]);
            // R3
            // selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "EL", "EL(NA)", "MT", "MT(NA)", "CPA", "EBS"]);
            selectedGroups.push(["ALL"]);
            // R4
            // selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "EL", "EL(NA)", "MT", "MT(NA)", "CPA", "EBS"]);
            selectedGroups.push(["ALL"]);
            // useBonus = true;
            // useMathSci = true;
            break;
        // ELB3
        case 1:
            // R1
            // selectedGroups.push(["EL(NA)", "EL"]);
            // R2
            selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // R3
            selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // R4
            selectedGroups.push(["EMATH(NA)", "EMATH", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // useBonus = false;
            useEL = true;
            break;
        // MAB3
        case 2:
            // R1
            selectedGroups.push(["EL", "EL(NA)", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // R3
            selectedGroups.push(["EL", "EL(NA)", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // R4
            selectedGroups.push(["EL", "EL(NA)", "SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // useBonus = false;
            useMath = true;
            break;
        // B4
        case 3:
            // R1
            selectedGroups.push(["ALL"]);
            // R2
            selectedGroups.push(["ALL"]);
            // R3
            selectedGroups.push(["ALL"]);
            // R4
            selectedGroups.push(["ALL"]);
            // useBonus = false;
            break;
        // ELMAB2
        case 4:
            // R1
            // selectedGroups.push([ "EL(NA)", "EL"]);
            // R2
            // selectedGroups.push([ "EMATH", "EMATH(NA)" ]);
            // R3
            selectedGroups.push(["SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // R4
            selectedGroups.push(["SCI(NA)", "SCI", "MT", "MT(NA)", "CPA", "EBS"]);
            // useHMT = false;
            // useBonus = false;
            useELMath = true;
            break;
    }
    //console.log("EL", basePool, selectedGroups);

    scoreData = getScoreFromGroups(basePool, selectedGroups);
    // console.log(scoreData);

    if (useEL)
    {
        basePool = createGradePool(2);
        scoreData["score"] = Number(baseEL) + scoreData["score"];
        if (caseEL == 1) 
        {
            scoreData["chosenSubjs"].unshift("EL");
        }
        else if(caseEL == 2)
        {
            scoreData["chosenSubjs"].unshift("EL(NA)");
        }

    }

    if (useMath)
    {
        basePool = createGradePool(3);
        scoreData["score"] = Number(baseEMath) + scoreData["score"];
        if (caseEMath == 1) 
        {
            scoreData["chosenSubjs"].unshift("EMATH");
        }
        else if(caseEMath == 2)
        {
            scoreData["chosenSubjs"].unshift("EMATH(NA)");
        }
    }

    if (useELMath)
    {
        basePool = createGradePool(4);
        scoreData["score"] = Number(baseEL) + Number(baseEMath) + scoreData["score"];
        if (caseEL == 1) 
        {
            scoreData["chosenSubjs"].unshift("EL");
        }
        else if(caseEL == 2)
        {
            scoreData["chosenSubjs"].unshift("EL(NA)");
        }

        if (caseEMath == 1) 
        {
            scoreData["chosenSubjs"].unshift("EMATH");
        }
        else if(caseEMath == 2)
        {
            scoreData["chosenSubjs"].unshift("EMATH(NA)");
        }

    }

    if (useMathSci)
    {
        basePool = createGradePool(1);
        if (baseEMath === undefined && baseSci === undefined)
        {
            return scoreData;
        }
        // else if (count == 4 && baseEMath != undefined && baseSci != undefined)
        // {
        //     scoreData["chosenSubjs"].pop();
        //     // Get 'popped' element's score and deduct it from score
        //     scoreData["score"] = Number(baseSci) + Number(baseEMath) + scoreData["score"];
        //     // Add Math score
        //     if (caseEMath == 1) 
        //     {
        //         scoreData["chosenSubjs"].unshift("EMATH");
        //     }
        //     else if(caseEMath == 2)
        //     {
        //         scoreData["chosenSubjs"].unshift("EMATH(NA)");
        //     }

        //     // Add Science score
        //     if (caseSci == 1) 
        //     {
        //         scoreData["chosenSubjs"].unshift("SCI");
        //     }
        //     else if(caseSci == 2)
        //     {
        //         scoreData["chosenSubjs"].unshift("SCI(NA)");
        //     }

        // }
        else if (baseEMath <= baseSci)
        {
            // Use EMath for Ma/Sc B3 if score is better than or same as Sci
            scoreData["score"] = + Number(baseEMath) + scoreData["score"];
            if (caseEMath == 1) 
            {
                scoreData["chosenSubjs"].unshift("EMATH");
            }
            else if(caseEMath == 2)
            {
                scoreData["chosenSubjs"].unshift("EMATH(NA)");
            }
        }
        else if (baseEMath > baseSci)
        {
            scoreData["score"] = Number(baseSci) + scoreData["score"];
            // Use Sci for Ma/Sc B3 if score is better than EMath
            if (caseSci == 1) 
            {
                scoreData["chosenSubjs"].unshift("SCI");
            }
            else if(caseSci == 2)
            {
                scoreData["chosenSubjs"].unshift("SCI(NA)");
            }
        }
    }

    //console.log(scoreData, tmpScoreData);

    if (tmpScoreData["score"] === -1)
    {
        tmpScoreData = scoreData;
    }

    let ret = (Number(scoreData["score"]) > Number(tmpScoreData["score"])) ? tmpScoreData : scoreData;

    if (useBonus && bonus !== undefined)
    {
        ret["score"] -= bonus;
    }

    return ret;
}

function getScoreFromGroups(basePool, selectedGroups)
{
    let score = 0;
    let chosen = [];
    let scoreSubjs = [];
    let grps = [];
    let ret = {
        score: -1,
        chosenSubjs: [],
    };
    if (selectedGroups.length === 0)
    {
        return ret;
    }

    // console.log("selected", selectedGroups);
    //console.log("score check", basePool);

    for (let g of selectedGroups)
    {
        if (g[0].localeCompare("ALL") === 0)
        {
            grps = Object.keys(basePool);
        }
        else
        {
            grps = g;
        }
        chosen = [];
        for (let s of grps)
        {
            if (basePool[s] !== undefined && basePool[s].length > 0)
            {
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
        if (chosen.length == 0)
        {
            return ret;
        }
        score += Number(basePool[chosen[0]["subj"]].shift()["grade"]);
        scoreSubjs.push(chosen[0]["subjName"]);
    }
    //console.log(scoreSubjs, score);
    ret["score"] = score;
    ret["chosenSubjs"] = scoreSubjs
    return ret;
}

// Adds all grades to pool except for EL and HMT (and MT / CLB if HMT is base)
function createGradePool(baseType = 0)
{
    let ret = {};
    let ignored = {
        "BONUS": 1,
    };

    // Ma/Sc B3 ignore Ma, Sc (Because its added later)
    if (baseType === 1)
    {
        ignored["EMATH"] = 1;
        ignored["EMATH(NA)"] = 1;
        ignored["SCI"] = 1;
        ignored["SCI(NA)"] = 1;
    }

    // ELB3 ignore EL (Because its added later)
    if (baseType === 2)
    {
        ignored["EL"] = 1;
        ignored["EL(NA)"] = 1;
    }

    // MAB3 ignore MA (Because its added later)
    if (baseType === 3)
    {
        ignored["EMATH"] = 1;
        ignored["EMATH(NA)"] = 1;
    }

    // ELMAB3 ignore EL, MA (Because its added later)
    if (baseType === 4)
    {
        ignored["EL"] = 1;
        ignored["EL(NA)"] = 1;
        ignored["EMATH"] = 1;
        ignored["EMATH(NA)"] = 1;
    }

    for (let n in grades)
    {
        //console.log(n);
        if (ignored[n] === undefined)
        {
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

function countSubjects()
{
    let count = 0;
    for (let n in grades)
    {
        count += grades[n]["data"].length;
    }

    return count;
}

function getGrade(name, num = 0)
{
    if (grades && grades[name] !== undefined)
    {
        if (grades[name]["data"][num] !== undefined)
        {
            return grades[name]["data"][num]["grade"];
        }
    }

    return undefined;
}

function convertStringArrayToString(arr)
{
    //console.log(arr);
    let ret = "";

    for (let v of arr)
    {
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
