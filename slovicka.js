const velikostBloku = 15;
const zkouseniPocetSlovicek = 25
let aktivniCZ = null;
let aktivniEN = null;
let chybaPocet = 0;
let chybyDetail = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function resetVyber() {
  document.querySelectorAll("td.selected, td.wrong").forEach(td => td.classList.remove("selected", "wrong"));
  aktivniCZ = null;
  aktivniEN = null;
}

function zobrazUceni(lekceCislo) {
  const vystup = document.getElementById("vystup");
  vystup.innerHTML = "";
  const slova = slovickaLekce[lekceCislo] || [];
  for (let i = 0; i < slova.length; i += velikostBloku) {
    const blok = slova.slice(i, i + velikostBloku);
    const wrapper = document.createElement("div");
    wrapper.className = "custom-table-wrapper";
    const table = document.createElement("table");
    table.className = "table my-4 table-responsive";
    blok.forEach(pair => {
      const row = document.createElement("tr");
      const tdCZ = document.createElement("td");
      const tdEN = document.createElement("td");
      tdCZ.textContent = pair.cesky;
      tdEN.textContent = pair.anglicky;
      row.appendChild(tdCZ);
      row.appendChild(tdEN);
      table.appendChild(row);
    });
    wrapper.appendChild(table);
    vystup.appendChild(wrapper);
  }
}

function zobrazProcvicovani(lekceCislo) {
  const vystup = document.getElementById("vystup");
  vystup.innerHTML = "";
  const slova = slovickaLekce[lekceCislo] || [];
  for (let i = 0; i < slova.length; i += velikostBloku) {
    const blok = slova.slice(i, i + velikostBloku);
    const czSlova = blok.map(p => p.cesky);
    const enSlova = blok.map(p => p.anglicky);
    shuffle(czSlova);
    shuffle(enSlova);

    const wrapper = document.createElement("div");
    wrapper.className = "custom-table-wrapper";
    const table = document.createElement("table");
    table.className = "table my-4 table-responsive";

    for (let j = 0; j < blok.length; j++) {
      const row = document.createElement("tr");
      const tdCZ = document.createElement("td");
      const tdEN = document.createElement("td");
      tdCZ.textContent = czSlova[j];
      tdEN.textContent = enSlova[j];
      tdCZ.dataset.typ = "cz";
      tdEN.dataset.typ = "en";
      tdCZ.dataset.hodnota = czSlova[j];
      tdEN.dataset.hodnota = enSlova[j];
      tdCZ.addEventListener("click", () => klikNaBunku(tdCZ, blok));
      tdEN.addEventListener("click", () => klikNaBunku(tdEN, blok));
      row.appendChild(tdCZ);
      row.appendChild(tdEN);
      table.appendChild(row);
    }
    wrapper.appendChild(table);
    vystup.appendChild(wrapper);
  }
}

function klikNaBunku(td, blok) {
  if (td.classList.contains("correct")) return;
  const typ = td.dataset.typ;
  if (typ === "cz") {
    if (aktivniCZ) aktivniCZ.classList.remove("selected");
    aktivniCZ = td;
    td.classList.add("selected");
  } else {
    if (aktivniEN) aktivniEN.classList.remove("selected");
    aktivniEN = td;
    td.classList.add("selected");
  }
  if (aktivniCZ && aktivniEN) {
    const spravne = blok.some(p => p.cesky === aktivniCZ.dataset.hodnota && p.anglicky === aktivniEN.dataset.hodnota);
    if (spravne) {
      aktivniCZ.classList.add("correct");
      aktivniEN.classList.add("correct");
    } else {
      aktivniCZ.classList.add("wrong");
      aktivniEN.classList.add("wrong");
    }
    setTimeout(() => resetVyber(), 600);
  }
}

function zobrazZkouseni(lekceCislo) {
  chybaPocet = 0;
	chybyDetail = [];
  const vystup = document.getElementById("vystup");
  vystup.innerHTML = "";
  let slova = [...(slovickaLekce[lekceCislo] || [])];
  shuffle(slova);
  slova = slova.slice(0, zkouseniPocetSlovicek); // použít definovaný počet slovíček

  for (let i = 0; i < slova.length; i += velikostBloku) {
    const blok = slova.slice(i, i + velikostBloku);
    const czSlova = blok.map(p => p.cesky);
    const enSlova = blok.map(p => p.anglicky);
    shuffle(czSlova);
    shuffle(enSlova);

    const wrapper = document.createElement("div");
    wrapper.className = "custom-table-wrapper";
    const table = document.createElement("table");
    table.className = "table my-4 table-responsive";

    for (let j = 0; j < blok.length; j++) {
      const row = document.createElement("tr");
      const tdCZ = document.createElement("td");
      const tdEN = document.createElement("td");
      tdCZ.textContent = czSlova[j];
      tdEN.textContent = enSlova[j];
      tdCZ.dataset.typ = "cz";
      tdEN.dataset.typ = "en";
      tdCZ.dataset.hodnota = czSlova[j];
      tdEN.dataset.hodnota = enSlova[j];
      tdCZ.classList.add("pairable");
      tdEN.classList.add("pairable");
      tdCZ.addEventListener("click", () => klikZkouseni(tdCZ, blok));
      tdEN.addEventListener("click", () => klikZkouseni(tdEN, blok));
      row.appendChild(tdCZ);
      row.appendChild(tdEN);
      table.appendChild(row);
    }

    wrapper.appendChild(table);
    vystup.appendChild(wrapper);
  }

  const vysledekDiv = document.createElement("div");
  vysledekDiv.id = "vysledek";
  vysledekDiv.className = "text-center fw-bold mt-3";
  vystup.appendChild(vysledekDiv);
}


function klikZkouseni(td, blok) {
  if (td.classList.contains("correct")) return;
  const typ = td.dataset.typ;
  if (typ === "cz") {
    if (aktivniCZ) aktivniCZ.classList.remove("selected");
    aktivniCZ = td;
    td.classList.add("selected");
  } else {
    if (aktivniEN) aktivniEN.classList.remove("selected");
    aktivniEN = td;
    td.classList.add("selected");
  }
  if (aktivniCZ && aktivniEN) {
    const spravne = blok.some(p => p.cesky === aktivniCZ.dataset.hodnota && p.anglicky === aktivniEN.dataset.hodnota);
    if (spravne) {
      aktivniCZ.classList.add("correct");
      aktivniEN.classList.add("correct");
    } else {
      chybaPocet++;
      aktivniCZ.classList.add("wrong");
      aktivniEN.classList.add("wrong");
      const spravny = blok.find(p => p.cesky === aktivniCZ.dataset.hodnota);
      if (spravny) {
        chybyDetail.push({
          cesky: aktivniCZ.dataset.hodnota,
          spatne: aktivniEN.dataset.hodnota,
          spravne: spravny.anglicky
        });
      }
    }
    setTimeout(() => {
      resetVyber();
      zkontrolujDokonceni();
    }, 600);
  }
}


function zkontrolujDokonceni() {
  const vsechny = document.querySelectorAll("td.pairable");
  const spravne = document.querySelectorAll("td.correct");
  const vysledekDiv = document.getElementById("vysledek");
  if (spravne.length === vsechny.length) {
    let html = `<p>Hotovo! Počet chyb: ${chybaPocet}</p>`;
    if (chybyDetail.length > 0) {
      html += `
				<div class="custom-table-wrapper">
					<table class="table table-bordered my-4">
						<thead class="table-light">
							<tr>
								<th>České slovo</th>
								<th>Špatně</th>
								<th>Správně</th>
							</tr>
						</thead>
						<tbody>
			`;

      chybyDetail.forEach(chyba => {
        html += `
          <tr>
            <td>${chyba.cesky}</td>
            <td class="wrong text-black">${chyba.spatne}</td>
            <td class="correct text-black">${chyba.spravne}</td>
          </tr>
        `;
      });
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    vysledekDiv.innerHTML = html;
  }
}




function zpracujZmenu() {
  const rezim = document.querySelector("input[name=mod]:checked").value;
  const lekce = document.getElementById("lekceSelect").value;
  if (rezim === "uceni") zobrazUceni(lekce);
  else if (rezim === "procvicovani") zobrazProcvicovani(lekce);
  else if (rezim === "zkouseni") zobrazZkouseni(lekce);
}

document.getElementById("lekceSelect").addEventListener("change", zpracujZmenu);
document.querySelectorAll("input[name=mod]").forEach(radio => radio.addEventListener("change", zpracujZmenu));

window.onload = () => {
  zobrazUceni(document.getElementById("lekceSelect").value);
};