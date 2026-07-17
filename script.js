const categories = {
	compras: {
		label: "Compras",
		icon: "🛒",
		concepts: [
			"Bolsa para basura",
			"Bolsa de asa",
			"Servilletas",
			"Cloro",
			"Limpiador para piso",
			"Limpiador para estufa",
			"Estropajos para trastes",
			"Jabón líquido para trastes",
			"Garrafón de agua",
			"Rollo",
			"Jabón líquido para el baño",
		],
	},
	servicios: {
		label: "Servicios",
		icon: "💡",
		concepts: ["Internet", "Luz"],
	},
	tareas: {
		label: "Tareas",
		icon: "🧹",
		concepts: ["Limpiar el baño", "Limpiar las áreas comunes", "Limpiar el refrigerador"],
	},
};

const roommates = {
	julio: {
		name: "Julio",
		concepts: {
			"Jabón líquido para trastes": "✅ 15/07/2026",
			"Garrafón de agua": "✅ Fecha desconocida",
			Internet: "❌ 00/00/0000",
			Luz: "❌ 00/00/0000",
		},
	},
	osmar: {
		name: "Osmar",
		concepts: {
			Servilletas: "✅ Fecha desconocida",
			"Limpiador para estufa": "✅ 15/07/2026",
			"Estropajos para trastes": "✅ Fecha desconocida",
			"Garrafón de agua": "✅ Fecha desconocida",
			Rollo: "✅ Fecha desconocida",
			"Jabón líquido para el baño": "✅ Fecha desconocida",
			Internet: "✅ 09/07/2026",
			Luz: "✅ 30/05/2026",
		},
	},
	ivan: {
		name: "Ivan",
		concepts: {
			"Bolsa para basura": "✅ 01/03/2026",
			"Bolsa de asa": "✅ 01/03/2026",
			Servilletas: "✅ 27/06/2026",
			Cloro: "❌ 00/00/0000",
			"Limpiador para piso": "✅ 11/07/2026",
			"Limpiador para estufa": "❌ 00/00/0000",
			"Estropajos para trastes": "✅ 11/06/2026",
			"Jabón líquido para trastes": "✅ 16/07/2026",
			"Garrafón de agua": "✅ 15/07/2026",
			Rollo: "✅ 01/06/2026",
			"Jabón líquido para el baño": "✅ 11/06/2026",
			Internet: "✅ 09/07/2026",
			Luz: "✅ 02/04/2026",
			"Limpiar el baño": "✅ 27/06/2026",
			"Limpiar las áreas comunes": "✅ 11/06/2026",
			"Limpiar el refrigerador": "❌ 00/00/0000",
		},
	},
};

const DEFAULT_PENDING = "❌ 00/00/0000";
const UNKNOWN_DATE = "Fecha desconocida";

const appState = {
	selectedCategory: "all",
	selectedStatus: "all",
	searchTerm: "",
	sortBy: "name",
	sortDirection: "asc",
};

const roommatesList = Object.values(roommates).map((roommate) => roommate.name);

const dom = {
	currentDate: document.getElementById("currentDate"),
	roommatesCards: document.getElementById("roommatesCards"),
	categoryFilters: document.getElementById("categoryFilters"),
	statusFilters: document.getElementById("statusFilters"),
	searchInput: document.getElementById("searchInput"),
	sortBy: document.getElementById("sortBy"),
	sortDirection: document.getElementById("sortDirection"),
	tableHead: document.getElementById("tableHead"),
	tableBody: document.getElementById("tableBody"),
};

const allConcepts = buildConceptsIndex();

function init() {
	normalizeRoommateData();
	renderCurrentDate();
	renderRoommateCards();
	renderFilters();
	renderTableHead();
	bindEvents();
	renderTableBody();
}

function buildConceptsIndex() {
	const rows = [];

	Object.entries(categories).forEach(([categoryKey, category]) => {
		category.concepts.forEach((concept) => {
			rows.push({
				concept,
				categoryKey,
				categoryLabel: category.label,
				categoryIcon: category.icon,
			});
		});
	});

	return rows;
}

function normalizeRoommateData() {
	allConcepts.forEach(({ concept }) => {
		Object.values(roommates).forEach((roommate) => {
			if (!roommate.concepts[concept]) {
				roommate.concepts[concept] = DEFAULT_PENDING;
			}
		});
	});
}

function renderCurrentDate() {
	const today = new Date();
	const date = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	dom.currentDate.textContent = `Fecha actual: ${date}/${month}/${year}`;
}

function renderRoommateCards() {
	const cardsHTML = Object.values(roommates)
		.map(({ name }) => {
			const initial = name.charAt(0).toUpperCase();
			return `
				<article class="roommate-card" aria-label="Roomie ${name}">
					<span class="avatar" aria-hidden="true">${initial}</span>
					<p class="text-base font-bold text-slate-800">${name}</p>
				</article>
			`;
		})
		.join("");

	dom.roommatesCards.innerHTML = cardsHTML;
}

function renderFilters() {
	const categoryOptions = [
		{ key: "all", label: "Todos" },
		...Object.entries(categories).map(([key, category]) => ({ key, label: category.label })),
	];

	const statusOptions = [
		{ key: "all", label: "Todos" },
		{ key: "pending", label: "Pendientes" },
		{ key: "completed", label: "Completados" },
	];

	dom.categoryFilters.innerHTML = categoryOptions
		.map((option) => createFilterButton(option, "category"))
		.join("");

	dom.statusFilters.innerHTML = statusOptions
		.map((option) => createFilterButton(option, "status"))
		.join("");
}

function createFilterButton(option, type) {
	const isActive =
		(type === "category" && appState.selectedCategory === option.key) ||
		(type === "status" && appState.selectedStatus === option.key);

	return `
		<button
			type="button"
			class="filter-btn ${isActive ? "is-active" : ""}"
			data-filter-type="${type}"
			data-value="${option.key}"
			aria-pressed="${isActive}"
		>
			${option.label}
		</button>
	`;
}

function renderTableHead() {
	const columns = ["Concepto", ...roommatesList];

	dom.tableHead.innerHTML = `
		<tr>
			${columns
				.map((column) => `<th scope="col" class="text-left">${column}</th>`)
				.join("")}
		</tr>
	`;
}

function renderTableBody() {
	const filteredRows = getProcessedRows();

	if (!filteredRows.length) {
		dom.tableBody.innerHTML = `
			<tr class="empty-state">
				<td colspan="${roommatesList.length + 1}">
					No hay conceptos que coincidan con los filtros actuales.
				</td>
			</tr>
		`;
		return;
	}

	const grouped = groupRowsByCategory(filteredRows);
	const bodyParts = [];

	Object.entries(grouped).forEach(([categoryKey, rows]) => {
		const category = categories[categoryKey];
		bodyParts.push(`
			<tr class="group-row">
				<td colspan="${roommatesList.length + 1}">${category.icon} ${category.label}</td>
			</tr>
		`);

		rows.forEach((row) => {
			bodyParts.push(createDataRow(row));
		});
	});

	dom.tableBody.innerHTML = bodyParts.join("");
}

function getProcessedRows() {
	let rows = [...allConcepts];

	rows = rows.filter(matchesCategoryFilter);
	rows = rows.filter(matchesStatusFilter);
	rows = rows.filter(matchesSearchFilter);
	rows.sort(getSortComparator());

	return rows;
}

function matchesCategoryFilter(row) {
	return appState.selectedCategory === "all" || row.categoryKey === appState.selectedCategory;
}

function matchesStatusFilter(row) {
	if (appState.selectedStatus === "all") {
		return true;
	}

	const statuses = getConceptStatuses(row.concept);
	if (appState.selectedStatus === "pending") {
		return statuses.some((status) => !status.isComplete);
	}

	return statuses.some((status) => status.isComplete);
}

function matchesSearchFilter(row) {
	if (!appState.searchTerm) {
		return true;
	}

	return row.concept.toLowerCase().includes(appState.searchTerm);
}

function getSortComparator() {
	const direction = appState.sortDirection === "asc" ? 1 : -1;

	return (a, b) => {
		if (appState.sortBy === "status") {
			const scoreA = getStatusScore(a.concept);
			const scoreB = getStatusScore(b.concept);
			if (scoreA !== scoreB) {
				return (scoreA - scoreB) * direction;
			}
			return a.concept.localeCompare(b.concept, "es") * direction;
		}

		if (appState.sortBy === "date") {
			const dateA = getMostRecentDateTimestamp(a.concept);
			const dateB = getMostRecentDateTimestamp(b.concept);
			if (dateA !== dateB) {
				return (dateA - dateB) * direction;
			}
			return a.concept.localeCompare(b.concept, "es") * direction;
		}

		return a.concept.localeCompare(b.concept, "es") * direction;
	};
}

function getStatusScore(concept) {
	const statuses = getConceptStatuses(concept);
	const completedCount = statuses.filter((status) => status.isComplete).length;
	return completedCount;
}

function getMostRecentDateTimestamp(concept) {
	const statuses = getConceptStatuses(concept);
	const timestamps = statuses
		.filter((status) => status.isComplete && status.dateText !== UNKNOWN_DATE)
		.map((status) => parseDateToTimestamp(status.dateText))
		.filter((timestamp) => Number.isFinite(timestamp));

	return timestamps.length ? Math.max(...timestamps) : -1;
}

function parseDateToTimestamp(dateText) {
	const [day, month, year] = dateText.split("/").map(Number);
	if (!day || !month || !year) {
		return Number.NaN;
	}
	return new Date(year, month - 1, day).getTime();
}

function getConceptStatuses(concept) {
	return Object.values(roommates).map((roommate) => {
		const raw = roommate.concepts[concept] || DEFAULT_PENDING;
		const parsed = parseStatus(raw);
		return {
			roommate: roommate.name,
			...parsed,
		};
	});
}

function parseStatus(value) {
	const isComplete = value.startsWith("✅");
	const dateText = value.replace(/^✅\s*|^❌\s*/u, "").trim();
	return { isComplete, dateText };
}

function groupRowsByCategory(rows) {
	return rows.reduce((accumulator, row) => {
		if (!accumulator[row.categoryKey]) {
			accumulator[row.categoryKey] = [];
		}
		accumulator[row.categoryKey].push(row);
		return accumulator;
	}, {});
}

function createDataRow(row) {
	const statusCells = Object.values(roommates)
		.map((roommate) => createStatusCell(roommate.concepts[row.concept]))
		.join("");

	return `
		<tr class="data-row">
			<td class="font-semibold">${row.concept}</td>
			${statusCells}
		</tr>
	`;
}

function createStatusCell(rawStatus) {
	const { isComplete, dateText } = parseStatus(rawStatus);
	const badgeClass = isComplete ? "status-badge status-complete" : "status-badge status-pending";
	const icon = isComplete ? "✅" : "❌";
	const content = `${icon} ${dateText}`;

	return `
		<td>
			<span class="${badgeClass}">${content}</span>
		</td>
	`;
}

function bindEvents() {
	dom.categoryFilters.addEventListener("click", onFilterClick);
	dom.statusFilters.addEventListener("click", onFilterClick);

	dom.searchInput.addEventListener("input", (event) => {
		appState.searchTerm = event.target.value.trim().toLowerCase();
		renderTableBody();
	});

	dom.sortBy.addEventListener("change", (event) => {
		appState.sortBy = event.target.value;
		renderTableBody();
	});

	dom.sortDirection.addEventListener("change", (event) => {
		appState.sortDirection = event.target.value;
		renderTableBody();
	});
}

function onFilterClick(event) {
	const button = event.target.closest("button[data-filter-type]");
	if (!button) {
		return;
	}

	const type = button.dataset.filterType;
	const value = button.dataset.value;

	if (type === "category") {
		appState.selectedCategory = value;
	}

	if (type === "status") {
		appState.selectedStatus = value;
	}

	renderFilters();
	bindFilterListenersAgain();
	renderTableBody();
}

function bindFilterListenersAgain() {
	dom.categoryFilters.removeEventListener("click", onFilterClick);
	dom.statusFilters.removeEventListener("click", onFilterClick);
	dom.categoryFilters.addEventListener("click", onFilterClick);
	dom.statusFilters.addEventListener("click", onFilterClick);
}

init();
