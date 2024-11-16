"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_1 = require("react");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("@/lib/firebase");
function ViewContribution(props) {
    console.log(props);
    var _a = react_1.useState(null), contributions = _a[0], setContributions = _a[1];
    var _b = react_1.useState(""), deleteError = _b[0], setDeleteError = _b[1];
    react_1.useEffect(function () {
        function filterContributions() {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    data = [];
                    props.data.datesAdded.forEach(function (item) {
                        if (props.data.monthYear == item.monthYear) {
                            data.push(item);
                        }
                    });
                    console.log(data);
                    setContributions(data);
                    return [2 /*return*/];
                });
            });
        }
        filterContributions();
    }, []);
    function uploadActivity() {
        try {
            var activityRef = firestore_1.collection(firebase_1.db, "activity");
            var owner = localStorage.getItem("userEmail");
            var date = new Date();
            var options = { hour: "numeric", minute: "2-digit" };
            var currTime = date.toLocaleTimeString("en-US", options);
            var activity = "Delete";
            firestore_1.addDoc(activityRef, {
                resource: "Project",
                activity: activity,
                owner: owner,
                date: new Date(),
                time: currTime
            })
                .then(function () {
                window.location.reload();
            })["catch"](function (error) {
                setDeleteError("Could not delete");
            });
        }
        catch (error) {
            setDeleteError("Could not delete");
        }
    }
    function deleteHandler(id) {
        var docRef = firestore_1.doc(firebase_1.db, "contribution", id);
        firestore_1.deleteDoc(docRef)
            .then(function () {
            console.log("deleted");
            // window.location.reload();
            uploadActivity();
        })["catch"](function (err) {
            console.log(err);
            setDeleteError("Could not delete");
        });
    }
    return (React.createElement("div", { className: "flex flex-col gap-y-4" },
        React.createElement("div", { className: "flex flex-row justify-between flex-wrap space-x-10 my-5" },
            React.createElement("span", { className: "font-bold" }, "Month -  " + props.data.monthYear),
            React.createElement("span", { className: "font-bold" }, "Total Amount - GHS " + props.data.totalContributions)),
        deleteError && (React.createElement("div", { className: "text-center text-sm font-regular text-white bg-red-400 border p-1 rounded" },
            React.createElement("span", null, deleteError))),
        React.createElement("table", { className: "border-separate table-auto border-spacing-y-[10px] text-[15px] w-[100%] flex-wrap text-sm" },
            React.createElement("thead", null,
                React.createElement("tr", { className: "text-left" },
                    React.createElement("th", null, "Date"),
                    React.createElement("th", null, "Amount"),
                    React.createElement("th", null))),
            contributions ? (React.createElement("tbody", null, contributions.map(function (item) { return (React.createElement("tr", { key: item.id, className: "hover:bg-gray-300" },
                React.createElement("td", null, item.date),
                React.createElement("td", null, item.amount),
                React.createElement("td", null,
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTrash, color: "red", onClick: function () { return deleteHandler(item.id); } })))); }))) : (React.createElement("span", null, "Loading contributions")))));
}
exports["default"] = ViewContribution;
