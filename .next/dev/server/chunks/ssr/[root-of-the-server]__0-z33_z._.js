module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/.next-internal/server/app/(app)/settings/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/settings.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00f676a0033c6eae94ec52c55ba4e907c0e5b9eeb6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logout"],
    "4027c480619e81619d4ee7c848d1ee3ad8b82f7f55",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSettings"],
    "60e2784baf9332cc11a6b0bb7c48f7c8c77447f597",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changeRolePassword"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$app$292f$settings$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(app)/settings/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/settings.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/settings.ts [app-rsc] (ecmascript)");
}),
"[project]/.next-internal/server/app/(app)/settings/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/settings.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$settings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/settings.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/app/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00f676a0033c6eae94ec52c55ba4e907c0e5b9eeb6":{"name":"logout"},"6080d391782617d5edebce3597bc466924f869c8ef":{"name":"login"},"60e2784baf9332cc11a6b0bb7c48f7c8c77447f597":{"name":"changeRolePassword"}},"app/actions/auth.ts",""] */ __turbopack_context__.s([
    "changeRolePassword",
    ()=>changeRolePassword,
    "login",
    ()=>login,
    "logout",
    ()=>logout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
const ROLE_HASH_FIELD = {
    Admin: "adminPasswordHash",
    Clerk: "clerkPasswordHash",
    Viewer: "viewerPasswordHash"
};
async function login(role, password) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ROLES"].includes(role)) {
        return {
            success: false,
            error: "Invalid role"
        };
    }
    const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].settings.findUnique({
        where: {
            id: 1
        }
    });
    if (!settings) {
        return {
            success: false,
            error: "App is not set up yet"
        };
    }
    const hash = settings[ROLE_HASH_FIELD[role]];
    const valid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
    if (!valid) {
        return {
            success: false,
            error: "Incorrect password"
        };
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setSessionCookie"])(role);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
}
async function logout() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearSessionCookie"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
}
async function changeRolePassword(role, newPassword) {
    const callerRole = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSessionRole"])();
    if (callerRole !== "Admin") {
        return {
            success: false,
            error: "Only Admin can change passwords"
        };
    }
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ROLES"].includes(role)) {
        return {
            success: false,
            error: "Invalid role"
        };
    }
    if (newPassword.length < 4) {
        return {
            success: false,
            error: "Password must be at least 4 characters"
        };
    }
    const hash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].hash(newPassword, 10);
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].settings.update({
        where: {
            id: 1
        },
        data: {
            [ROLE_HASH_FIELD[role]]: hash
        }
    });
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    login,
    logout,
    changeRolePassword
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(login, "6080d391782617d5edebce3597bc466924f869c8ef", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logout, "00f676a0033c6eae94ec52c55ba4e907c0e5b9eeb6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(changeRolePassword, "60e2784baf9332cc11a6b0bb7c48f7c8c77447f597", null);
}),
"[project]/app/actions/settings.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4027c480619e81619d4ee7c848d1ee3ad8b82f7f55":{"name":"updateSettings"}},"app/actions/settings.ts",""] */ __turbopack_context__.s([
    "updateSettings",
    ()=>updateSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function updateSettings(input) {
    const role = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSessionRole"])();
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAdmin"])(role)) {
        return {
            success: false,
            error: "Only Admin can change settings"
        };
    }
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsSchema"].safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0]?.message ?? "Invalid settings"
        };
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].settings.upsert({
        where: {
            id: 1
        },
        update: parsed.data,
        create: {
            id: 1,
            ...parsed.data
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/settings");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/calendar");
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateSettings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSettings, "4027c480619e81619d4ee7c848d1ee3ad8b82f7f55", null);
}),
"[project]/lib/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRANCHES",
    ()=>BRANCHES,
    "BRANCH_ROW_COLOR",
    ()=>BRANCH_ROW_COLOR,
    "BRANCH_SHORT",
    ()=>BRANCH_SHORT,
    "CATEGORIES",
    ()=>CATEGORIES,
    "CATEGORY_COLORS",
    ()=>CATEGORY_COLORS,
    "PRIORITIES",
    ()=>PRIORITIES,
    "PRIORITY_COLORS",
    ()=>PRIORITY_COLORS,
    "REMINDER_PREFERENCES",
    ()=>REMINDER_PREFERENCES,
    "STATUSES",
    ()=>STATUSES,
    "STATUS_COLORS",
    ()=>STATUS_COLORS,
    "WEEK_START_OPTIONS",
    ()=>WEEK_START_OPTIONS,
    "formatBranches",
    ()=>formatBranches,
    "getBranchRowColor",
    ()=>getBranchRowColor,
    "parseBranches",
    ()=>parseBranches
]);
const BRANCHES = [
    "A Branch",
    "Q Branch",
    "G Branch"
];
const BRANCH_SHORT = {
    "A Branch": "A",
    "Q Branch": "Q",
    "G Branch": "G"
};
function parseBranches(branches) {
    return branches.split(",").map((b)=>b.trim()).filter((b)=>BRANCHES.includes(b));
}
function formatBranches(branches) {
    return parseBranches(branches).map((b)=>BRANCH_SHORT[b]).join(", ");
}
const BRANCH_ROW_COLOR = {
    "A Branch": "#E3F0FB",
    "Q Branch": "#FBE0E2",
    "G Branch": "#EDE9C8",
    Common: "#E9E1F5"
};
function getBranchRowColor(branches) {
    const parsed = parseBranches(branches);
    if (parsed.length !== 1) return BRANCH_ROW_COLOR.Common;
    return BRANCH_ROW_COLOR[parsed[0]];
}
const CATEGORIES = [
    "Training",
    "Sports",
    "Administrative",
    "Other"
];
const PRIORITIES = [
    "High",
    "Normal",
    "Low"
];
const STATUSES = [
    "Pending",
    "In Progress",
    "Completed"
];
const REMINDER_PREFERENCES = [
    "None",
    "Same Day",
    "1 Day Before",
    "2 Days Before"
];
const WEEK_START_OPTIONS = [
    "Monday",
    "Sunday"
];
const CATEGORY_COLORS = {
    Training: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-500",
        dot: "bg-blue-500"
    },
    Sports: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-500",
        dot: "bg-emerald-500"
    },
    Administrative: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-500",
        dot: "bg-orange-500"
    },
    Other: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-500",
        dot: "bg-purple-500"
    }
};
const STATUS_COLORS = {
    Pending: {
        bg: "bg-slate-100",
        text: "text-slate-700"
    },
    "In Progress": {
        bg: "bg-amber-100",
        text: "text-amber-800"
    },
    Completed: {
        bg: "bg-combat-100",
        text: "text-combat-800"
    },
    Overdue: {
        bg: "bg-red-100",
        text: "text-red-700"
    }
};
const PRIORITY_COLORS = {
    High: {
        bg: "bg-red-100",
        text: "text-red-700"
    },
    Normal: {
        bg: "bg-sand-200",
        text: "text-sand-700"
    },
    Low: {
        bg: "bg-sand-100",
        text: "text-sand-500"
    }
};
}),
"[project]/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/lib/utils/date.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDDMMYYYY",
    ()=>formatDDMMYYYY,
    "formatDateRange",
    ()=>formatDateRange,
    "formatDayHeading",
    ()=>formatDayHeading,
    "formatHeaderDate",
    ()=>formatHeaderDate,
    "formatShortDate",
    ()=>formatShortDate,
    "isPast",
    ()=>isPast,
    "isTaskActiveOn",
    ()=>isTaskActiveOn,
    "isTaskActiveToday",
    ()=>isTaskActiveToday,
    "isToday",
    ()=>isToday,
    "nextNDays",
    ()=>nextNDays,
    "parseDDMMYYYY",
    ()=>parseDDMMYYYY,
    "today",
    ()=>today
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isSameDay.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addDays.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parse.js [app-rsc] (ecmascript) <locals>");
;
function today() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfDay"])(new Date());
}
function isToday(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSameDay"])(date, new Date());
}
function isPast(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfDay"])(date) < today();
}
function nextNDays(n) {
    const start = today();
    const end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDays"])(start, n);
    return {
        start,
        end
    };
}
function formatDayHeading(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "d MMMM").toUpperCase();
}
function formatShortDate(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "d MMM yyyy");
}
function formatHeaderDate(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "EEEE, d MMMM yyyy");
}
function formatDateRange(date, endDate) {
    if (!endDate || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isSameDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSameDay"])(date, endDate)) return formatShortDate(date);
    return `${formatShortDate(date)} - ${formatShortDate(endDate)}`;
}
function isTaskActiveOn(task, day) {
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfDay"])(task.date);
    const end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfDay"])(task.endDate ?? task.date);
    const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfDay"])(day);
    return d >= start && d <= end;
}
function isTaskActiveToday(task) {
    return isTaskActiveOn(task, new Date());
}
function parseDDMMYYYY(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parse"])(value, "dd/MM/yyyy", new Date());
}
function formatDDMMYYYY(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(date, "dd/MM/yyyy");
}
}),
"[project]/lib/validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "settingsSchema",
    ()=>settingsSchema,
    "taskSchema",
    ()=>taskSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/date.ts [app-rsc] (ecmascript)");
;
;
;
const optionalText = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional().transform((v)=>v ? v : undefined);
const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
const dateField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(DATE_PATTERN, "Date is required (DD/MM/YYYY)").transform((val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseDDMMYYYY"])(val)).refine((date)=>!isNaN(date.getTime()), {
    message: "Enter a valid date (DD/MM/YYYY)"
});
const endDateField = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional().default("").refine((v)=>v === "" || DATE_PATTERN.test(v), {
    message: "End date must be DD/MM/YYYY"
}).transform((v)=>v === "" ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$date$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseDDMMYYYY"])(v)).refine((date)=>date === null || !isNaN(date.getTime()), {
    message: "Enter a valid end date (DD/MM/YYYY)"
});
const taskSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Task name is required"),
    date: dateField,
    endDate: endDateField,
    time: optionalText,
    branches: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BRANCHES"])).min(1, "Select at least one branch").transform((arr)=>arr.join(",")),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CATEGORIES"], {
        message: "Category is required"
    }),
    responsiblePerson: optionalText,
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PRIORITIES"]).default("Normal"),
    remarks: optionalText
}).refine((data)=>!data.endDate || data.endDate >= data.date, {
    message: "End date must be on or after the start date",
    path: [
        "endDate"
    ]
});
const settingsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    unitName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Unit name is required"),
    defaultReminder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["REMINDER_PREFERENCES"]),
    weekStartsOn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["WEEK_START_OPTIONS"])
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-z33_z._.js.map