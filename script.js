const categories = {
	compras: {
		label: "Compras",
		concepts: [
			"Bolsa para basura",
			"Bolsa de asa",
			"Servilletas",
			"Limpiador para piso",
			"Limpiador para estufa",
			"Estropajos para trastes",
			"Jabón para trastes",
			"Garrafón de agua",
			"Papel de baño",
			"Jabón líquido para el baño",
			"Luz",
		],
	},
};

const roommates = {
	osmar: {
		name: "Osmar",
		concepts: {
			"Bolsa para basura": "13/08/2026",
			"Bolsa de asa": "23/10/2026",
			"Servilletas": "24/08/2026",
			"Limpiador para piso": "31/10/2026",
			"Limpiador para estufa": "15/07/2026",
			"Jabón para trastes": "31/10/2026",
			"Papel de baño": "31/10/2026",
			"Estropajos para trastes": "31/10/2026",
			"Garrafón de agua": "20/10/2026",
			"Jabón líquido para el baño": "31/10/2026",
			"Luz": "pendiente",
		},
	},
	ivan: {
		name: "Iván",
		concepts: {
			"Bolsa para basura": "01/03/2026",
			"Bolsa de asa": "01/03/2026",
			"Servilletas": "27/06/2026",
			"Limpiador para piso": "11/07/2026",
			"Limpiador para estufa": "pendiente",
			"Jabón para trastes": "19/10/2026",
			"Papel de baño": "19/09/2026",
			"Estropajos para trastes": "11/06/2026",
			"Garrafón de agua": "28/10/2026",
			"Jabón líquido para el baño": "11/06/2026",
			"Luz": "27/09/2026",
		},
	},
	cesar: {
		name: "César",
		concepts: {
			"Bolsa para basura": "pendiente",
			"Bolsa de asa": "pendiente",
			"Servilletas": "pendiente",
			"Limpiador para piso": "pendiente",
			"Limpiador para estufa": "pendiente",
			"Jabón para trastes": "pendiente",
			"Papel de baño": "pendiente",
			"Estropajos para trastes": "pendiente",
			"Garrafón de agua": "pendiente",
			"Jabón líquido para el baño": "pendiente",
			"Luz": "pendiente",
		},
	},
};

const DEFAULT_PENDING = "pendiente";

const roommateMeta = {
	osmar: { href: "osmar.html", color: "from-cyan-200 to-sky-300" },
	ivan: { href: "ivan.html", color: "from-amber-200 to-orange-300" },
	cesar: { href: "cesar.html", color: "from-violet-200 to-purple-300" },
};

const roommateOrder = ["ivan", "osmar", "cesar"];

const turnOverrides = {
	"Luz": "osmar",
	"Bolsa de asa": "cesar",
	"Servilletas": "cesar",
	"Jabón para trastes": "cesar",
};

const rulesImages = [
	"imgs/basura.png",
	"imgs/convivencia.jpeg",
	"imgs/reglas.jpeg",
	"imgs/servicios.png",
];

let currentRuleIndex = 0;
let touchStartX = 0;

const dom = {
	roommatesCards: document.getElementById("roommatesCards"),
	sharedTurns: document.getElementById("sharedTurns"),
	roomieDetail: document.getElementById("roomieDetail"),
	openRulesGallery: document.getElementById("openRulesGallery"),
	rulesModal: document.getElementById("rulesModal"),
	closeRulesGallery: document.getElementById("closeRulesGallery"),
	prevRule: document.getElementById("prevRule"),
	nextRule: document.getElementById("nextRule"),
	rulesImage: document.getElementById("rulesImage"),
	rulesCounter: document.getElementById("rulesCounter"),
	rulesTrack: document.getElementById("rulesTrack"),
};

function init() {
	if (dom.roommatesCards) {
		renderRoommateCards();
		renderSharedTurns();
		setupRulesGallery();
	}

	if (dom.roomieDetail) {
		renderRoomieDetail();
	}
}

function setupRulesGallery() {
	if (!dom.openRulesGallery || !dom.rulesModal || !dom.rulesImage) {
		return;
	}

	dom.openRulesGallery.addEventListener("click", openRulesGallery);
	dom.closeRulesGallery?.addEventListener("click", closeRulesGallery);
	dom.prevRule?.addEventListener("click", showPrevRule);
	dom.nextRule?.addEventListener("click", showNextRule);

	dom.rulesModal.addEventListener("click", (event) => {
		const target = event.target;
		if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
			closeRulesGallery();
		}
	});

	document.addEventListener("keydown", handleRulesKeyboard);

	dom.rulesTrack?.addEventListener("touchstart", (event) => {
		touchStartX = event.changedTouches[0]?.clientX || 0;
	});

	dom.rulesTrack?.addEventListener("touchend", (event) => {
		const touchEndX = event.changedTouches[0]?.clientX || 0;
		const deltaX = touchEndX - touchStartX;

		if (Math.abs(deltaX) < 45) {
			return;
		}

		if (deltaX < 0) {
			showNextRule();
			return;
		}

		showPrevRule();
	});

	renderRuleImage();
}

function openRulesGallery() {
	if (!dom.rulesModal) {
		return;
	}

	renderRuleImage();
	dom.rulesModal.classList.remove("hidden");
	document.body.style.overflow = "hidden";
}

function closeRulesGallery() {
	if (!dom.rulesModal) {
		return;
	}

	dom.rulesModal.classList.add("hidden");
	document.body.style.overflow = "";
}

function showNextRule() {
	if (!rulesImages.length) {
		return;
	}

	currentRuleIndex = (currentRuleIndex + 1) % rulesImages.length;
	renderRuleImage();
}

function showPrevRule() {
	if (!rulesImages.length) {
		return;
	}

	currentRuleIndex = (currentRuleIndex - 1 + rulesImages.length) % rulesImages.length;
	renderRuleImage();
}

function renderRuleImage() {
	if (!dom.rulesImage || !dom.rulesCounter || !rulesImages.length) {
		return;
	}

	const src = rulesImages[currentRuleIndex];
	dom.rulesImage.src = src;
	dom.rulesImage.alt = `Regla de convivencia ${currentRuleIndex + 1}`;
	dom.rulesCounter.textContent = `${currentRuleIndex + 1} de ${rulesImages.length}`;
}

function handleRulesKeyboard(event) {
	if (!dom.rulesModal || dom.rulesModal.classList.contains("hidden")) {
		return;
	}

	if (event.key === "Escape") {
		closeRulesGallery();
		return;
	}

	if (event.key === "ArrowRight") {
		showNextRule();
		return;
	}

	if (event.key === "ArrowLeft") {
		showPrevRule();
	}
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

function renderSharedTurns() {
	if (!dom.sharedTurns) {
		return;
	}

	const turnConcepts = [...categories.compras.concepts];
	const turns = turnConcepts.map((concept) => getTurnForConcept(concept));

	const turnsHTML = turns
		.map((turn) => {
			if (!turn.ownerKey) {
				return `
					<article class="glass-panel shared-turn-card">
						<p class="text-sm font-extrabold text-slate-800">${turn.concept}</p>
						<p class="mt-1 text-sm text-slate-600">No hay fechas válidas para asignar turno.</p>
					</article>
				`;
			}

			const owner = roommates[turn.ownerKey]?.name || turn.ownerKey;
			const ownerStatus = parseStatus(roommates[turn.ownerKey].concepts[turn.concept] || DEFAULT_PENDING);

			return `
				<article class="glass-panel shared-turn-card">
					<p class="text-sm font-extrabold text-slate-800">${turn.concept}</p>
					<p class="mt-1 text-sm text-slate-600">
						Responsable: <strong class="font-bold text-slate-800">${owner}</strong>.
						<span class="turn-status ${ownerStatus.isComplete ? "turn-status--complete" : "turn-status--pending"}">
							${ownerStatus.isComplete ? "Compra registrada" : "Debe comprarse"}
						</span>
					</p>
					<p class="mt-1 text-xs text-slate-500">
						${turn.isManual ? turn.oldestDateText : `Fecha de referencia: ${turn.oldestDateText}`}
					</p>
				</article>
			`;
		})
		.join("");

	dom.sharedTurns.innerHTML = turnsHTML;
}

function getTurnForConcept(concept) {
	const overrideOwnerKey = turnOverrides[concept];

	if (overrideOwnerKey) {
		return {
			concept,
			ownerKey: overrideOwnerKey,
			oldestDateText: "Asignación manual",
			isManual: true,
		};
	}

	const entries = roommateOrder
		.map((roommateKey) => {
			const raw = roommates[roommateKey]?.concepts?.[concept] || DEFAULT_PENDING;
			const date = extractDate(raw);

			return {
				roommateKey,
				date,
			};
		})
		.filter(Boolean);

	const withoutValidDate = entries.filter((entry) => !entry.date);

	if (withoutValidDate.length) {
		return {
			concept,
			ownerKey: withoutValidDate[0].roommateKey,
			oldestDateText: "Sin fecha válida",
		};
	}

	const candidates = [...entries].sort((a, b) => a.date - b.date);

	if (!candidates.length) {
		return {
			concept,
			ownerKey: "",
			oldestDateText: "Sin fecha",
		};
	}

	return {
		concept,
		ownerKey: candidates[0].roommateKey,
		oldestDateText: formatDate(candidates[0].date),
	};
}

function extractDate(value) {
	if (!value || value === "pendiente") {
		return null;
	}

	const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/u);

	if (!match) {
		return null;
	}

	const [, day, month, year] = match;
	const date = new Date(Number(year), Number(month) - 1, Number(day));

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}

function formatDate(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
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
					<h2 id="category-${categoryKey}" class="text-base font-extrabold text-slate-800">${category.label}</h2>
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
	const isComplete = value !== "pendiente";
	const date = isComplete ? extractDate(value) : null;
	const dateText = isComplete ? value : "Sin fecha de compra";
	return { isComplete, date, dateText };
}

init();
