"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function GroupManager() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState({
        group_name: "",
        description: "",
        members: []
    }), formData = _a[0], setFormData = _a[1];
    var _b = react_1.useState(null), editingGroupId = _b[0], setEditingGroupId = _b[1];
    var _c = react_1.useState([]), personas = _c[0], setPersonas = _c[1];
    var _d = react_1.useState([]), groups = _d[0], setGroups = _d[1];
    // Fetch personas and groups from backend
    var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, groupsResponse, personasResponse, groupsData, personasData, personaMap_1, updatedGroups, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Promise.all([
                            fetch("http://localhost:5000/api/groups"),
                            fetch("http://localhost:5000/api/personas"),
                        ])];
                case 1:
                    _a = _b.sent(), groupsResponse = _a[0], personasResponse = _a[1];
                    return [4 /*yield*/, groupsResponse.json()];
                case 2:
                    groupsData = _b.sent();
                    return [4 /*yield*/, personasResponse.json()];
                case 3:
                    personasData = _b.sent();
                    personaMap_1 = personasData.reduce(function (acc, persona) {
                        acc[persona.id] = persona.name;
                        return acc;
                    }, {});
                    updatedGroups = groupsData.map(function (group) { return (__assign(__assign({}, group), { members: group.members.map(function (memberId) { return ({
                            id: memberId,
                            name: personaMap_1[memberId] || "Unknown"
                        }); }) })); });
                    setGroups(updatedGroups);
                    setPersonas(personasData);
                    console.log("Updated Groups:", updatedGroups); // Debugging log
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Error fetching data:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // **Call fetchData inside useEffect only once on mount**
    react_1.useEffect(function () {
        fetchData();
    }, []);
    var handleMemberSelect = function (personaId) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { members: prev.members.some(function (member) { return member.id === personaId; })
                    ? prev.members.filter(function (member) { return member.id !== personaId; })
                    : __spreadArrays(prev.members, [{ id: personaId, name: ((_a = personas.find(function (p) { return p.id === personaId; })) === null || _a === void 0 ? void 0 : _a.name) || "Unknown" }]) }));
        });
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var url, method, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    url = editingGroupId
                        ? "http://localhost:5000/api/groups/" + editingGroupId
                        : "http://localhost:5000/api/groups";
                    method = editingGroupId ? "PUT" : "POST";
                    return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                group_name: formData.group_name,
                                description: formData.description,
                                members: formData.members.map(function (member) { return member.id; })
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    setFormData({ group_name: "", description: "", members: [] });
                    setEditingGroupId(null);
                    // **Wait for fetchData() to complete before updating UI**
                    return [4 /*yield*/, fetchData()];
                case 3:
                    // **Wait for fetchData() to complete before updating UI**
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error("Failed to create/update group");
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error creating/updating group:", error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (groupId) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("http://localhost:5000/api/groups/" + groupId, {
                            method: "DELETE"
                        })];
                case 1:
                    response = _a.sent();
                    if (response.ok) {
                        setGroups(function (prevGroups) { return prevGroups.filter(function (group) { return group.id !== groupId; }); });
                    }
                    else {
                        console.error("Failed to delete group");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error deleting group:", error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (groupId) {
        var selectedGroup = groups.find(function (group) { return group.id === groupId; });
        if (selectedGroup) {
            setFormData({
                group_name: selectedGroup.group_name,
                description: selectedGroup.description,
                members: selectedGroup.members.map(function (memberId) {
                    var persona = personas.find(function (p) { return p.id === memberId; });
                    return { id: memberId, name: persona ? persona.name : "Unknown" };
                })
            });
            setEditingGroupId(groupId);
        }
    };
    return (React.createElement("div", { className: "container mx-auto p-8" },
        React.createElement("div", { className: "flex items-center space-x-4 mb-8" },
            React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: function () { return router.back(); }, className: "hover:bg-gray-200 dark:hover:bg-gray-700" },
                React.createElement(lucide_react_1.ChevronLeft, { className: "h-6 w-6 text-gray-700 dark:text-gray-300" })),
            React.createElement("h1", { className: "text-5xl font-bold text-blue-700 dark:text-blue-400" }, "Groups Manager")),
        React.createElement("div", { className: "bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8" },
            React.createElement("h2", { className: "text-3xl font-semibold text-gray-900 dark:text-white border-b pb-3 mb-4" }, "Created Groups"),
            groups.length === 0 ? (React.createElement("p", { className: "text-gray-600 dark:text-gray-400" }, "No groups created yet.")) : (React.createElement("div", { className: "space-y-4" }, groups.map(function (group) { return (React.createElement(card_1.Card, { key: group.id, className: "p-5 bg-white dark:bg-gray-800 rounded-lg shadow" },
                React.createElement("div", { className: "flex justify-between items-center" },
                    React.createElement("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white" }, group.group_name),
                    React.createElement("div", { className: "flex space-x-2" },
                        React.createElement(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return handleEdit(group.id); }, className: "text-blue-600 hover:text-blue-800" },
                            React.createElement(lucide_react_1.Pencil, { className: "h-5 w-5 mr-1" }),
                            " Edit"),
                        React.createElement(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return handleDelete(group.id); }, className: "text-red-600 hover:text-red-800" },
                            React.createElement(lucide_react_1.Trash2, { className: "h-5 w-5 mr-1" }),
                            " Delete"))),
                React.createElement("p", { className: "text-gray-600 dark:text-gray-400 mt-1" }, group.description),
                React.createElement("div", { className: "mt-3" },
                    React.createElement(label_1.Label, { className: "text-gray-800 dark:text-gray-300" }, "Members:"),
                    group.members.length > 0 ? (React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" }, group.members.map(function (member) { return (React.createElement(badge_1.Badge, { key: member.id, className: "bg-blue-500 text-white" }, member.name)); }))) : (React.createElement("p", { className: "text-gray-500" }, "No members added"))))); })))),
        React.createElement("div", { className: "bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg" },
            React.createElement("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-6" }, editingGroupId ? "Edit Group" : "Create a New Group"),
            React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
                React.createElement("div", null,
                    React.createElement(label_1.Label, { htmlFor: "group_name" },
                        "Group Name ",
                        React.createElement("span", { className: "text-red-500" }, "*")),
                    React.createElement(input_1.Input, { id: "group_name", value: formData.group_name, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { group_name: e.target.value })); }, required: true })),
                React.createElement("div", null,
                    React.createElement(label_1.Label, { htmlFor: "description" }, "Description"),
                    React.createElement(textarea_1.Textarea, { id: "description", value: formData.description, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); } })),
                React.createElement("div", null,
                    React.createElement(label_1.Label, null, "Add Members"),
                    React.createElement(card_1.Card, { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow" }, personas.map(function (persona) {
                        // Check if persona is already a selected member
                        var isSelected = formData.members.some(function (m) { return m.id === persona.id; });
                        return (React.createElement("div", { key: persona.id, className: "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all " + (isSelected ? "bg-blue-200 dark:bg-blue-700" : "" // Highlight selected members
                            ), onClick: function () { return handleMemberSelect(persona.id); } },
                            React.createElement("h3", { className: "font-semibold" }, persona.name),
                            React.createElement("h3", { className: "font-semibold" }, persona.phone),
                            React.createElement(badge_1.Badge, { className: isSelected ? "bg-green-500 text-white" : "bg-gray-400" }, isSelected ? "Selected" : "Select")));
                    }))),
                React.createElement(button_1.Button, { type: "submit", className: "bg-blue-600 text-white" }, editingGroupId ? "Update Group" : "Create Group")))));
}
exports["default"] = GroupManager;
