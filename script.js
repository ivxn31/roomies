const categories = {
	compras: {
		label: "Compras",
		icon: "🛒",
		concepts: [
			"Bolsa para basura",
			"Bolsa de asa",
			"Servilletas",
			"Paquete de Cerrillos(la central)",
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
			"Paquete de Cerrillos(la central)": "✅ 01/03/2026",
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

const roommateMeta = {
	osmar: { href: "osmar.html", color: "from-cyan-200 to-sky-300" },
	julio: { href: "julio.html", color: "from-emerald-200 to-teal-300" },
	ivan: { href: "ivan.html", color: "from-amber-200 to-orange-300" },
};

const roommateOrder = ["osmar", "julio", "ivan"];

const dom = {
	currentDate: document.getElementById("currentDate"),
	roommatesCards: document.getElementById("roommatesCards"),
	roomieDetail: document.getElementById("roomieDetail"),
};

function init() {
	if (dom.roommatesCards) {
		renderCurrentDate();
		renderRoommateCards();
	}

	if (dom.roomieDetail) {
		renderRoomieDetail();
	}
}

function renderCurrentDate() {
	if (!dom.currentDate) {
		return;
	}

	const today = new Date();
	const date = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const year = today.getFullYear();
	dom.currentDate.textContent = `Fecha actual: ${date}/${month}/${year}`;
}

function renderRoommateCards() {
	const cardsHTML = roommateOrder
		.filter((key) => roommates[key])
		.map((key) => {
			const { name } = roommates[key];
			const initial = name.charAt(0).toUpperCase();
			const href = roommateMeta[key]?.href || "#";

			return `
				<a href="${href}" class="roommate-card" aria-label="Ir a la página de ${name}">
					<span class="avatar" aria-hidden="true">${initial}</span>
					<div>
						<p class="text-base font-bold text-slate-800">${name}</p>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ver detalle</p>
					</div>
				</a>
			`;
		})
		.join("");

	dom.roommatesCards.innerHTML = cardsHTML;
}

function renderRoomieDetail() {
	const key = dom.roomieDetail.dataset.roomie;
	const roommate = roommates[key];

	if (!roommate) {
		dom.roomieDetail.innerHTML = `
			<div class="glass-panel p-5 text-sm text-slate-600">
				No se encontró información para este roomie.
			</div>
		`;
		return;
	}

	const fullConceptList = getAllConcepts();
	const statuses = fullConceptList.map((concept) => {
		const raw = roommate.concepts[concept] || DEFAULT_PENDING;
		const parsed = parseStatus(raw);
		return {
			concept,
			raw,
			...parsed,
		};
	});

	const categoriesHTML = Object.entries(categories)
		.map(([categoryKey, category]) => {
			const itemsHTML = category.concepts
				.map((concept) => {
					const raw = roommate.concepts[concept] || DEFAULT_PENDING;
					const { isComplete, dateText } = parseStatus(raw);
					const badgeClass = isComplete
						? "status-badge status-complete"
						: "status-badge status-pending";
					const statusLabel = isComplete ? "Completado" : "Pendiente";

					return `
						<li class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
							<p class="text-sm font-semibold text-slate-800">${concept}</p>
							<div class="flex items-center gap-2">
								<span class="${badgeClass}">${statusLabel}</span>
								<span class="text-xs font-medium text-slate-500">${dateText}</span>
							</div>
						</li>
					`;
				})
				.join("");

			return `
				<section class="glass-panel p-4 sm:p-5" aria-labelledby="category-${categoryKey}">
					<div class="flex items-center gap-2">
						<span class="text-lg" aria-hidden="true">${category.icon}</span>
						<h2 id="category-${categoryKey}" class="text-base font-extrabold text-slate-800">${category.label}</h2>
					</div>
					<ul class="mt-3 space-y-2">
						${itemsHTML}
					</ul>
				</section>
			`;
		})
		.join("");

	dom.roomieDetail.innerHTML = `
		<div class="space-y-4">${categoriesHTML}</div>
	`;
}

function getAllConcepts() {
	return Object.values(categories).flatMap((category) => category.concepts);
}

function parseStatus(value) {
	const isComplete = value.startsWith("✅");
	const dateText = value.replace(/^✅\s*|^❌\s*/u, "").trim();
	return { isComplete, dateText };
}

init();
