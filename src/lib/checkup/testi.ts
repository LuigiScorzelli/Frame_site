import { PLUGIN_NAME } from "@/lib/brand";
import { MAX_CAMPI_TELEFONO, moduloPrincipale, type IdVoce, type Rilevamenti } from "./analisi";

// Visitor-facing copy of the check-up: Italian, voice "noi", the visitor is "tu".
// Explanations are built from what we found, never fixed sentences.

export const NOMI_VOCI: Record<IdVoce, string> = {
  contatto: "Contatto in un clic",
  fuori_orario: "Scrivere fuori orario",
  promessa: "Promessa di risposta",
  telefono: "Da telefono",
  informativa: "Informativa chiara",
};

function elenco(parti: string[]): string {
  if (parti.length <= 1) return parti.join("");
  return `${parti.slice(0, -1).join(", ")} e ${parti[parti.length - 1]}`;
}

function contatto(r: Rilevamenti, punti: number) {
  const ci = [r.tel && "chiamare con un tocco", r.mailto && "scrivere un'email con un tocco", r.whatsapp && "aprire WhatsApp"].filter(
    Boolean,
  ) as string[];
  const manca = [!r.tel && "il telefono cliccabile", !r.mailto && "l'email cliccabile", !r.whatsapp && "WhatsApp"].filter(
    Boolean,
  ) as string[];
  if (punti === 20) {
    return {
      spiegazione: `Dalla home si può ${elenco(ci)}: chi ha fretta ti raggiunge subito.`,
      rimedio: "Niente da sistemare. Controlla solo che numero ed email siano visibili anche da telefono.",
    };
  }
  if (ci.length === 0) {
    return {
      spiegazione:
        "Nella home non abbiamo trovato link per chiamare, scrivere un'email o aprire WhatsApp con un tocco: chi ti cerca deve copiare i recapiti a mano.",
      rimedio:
        "Rendi il numero un link tel: e l'email un link mailto: (in testata o nel footer), e valuta un pulsante WhatsApp.",
    };
  }
  return {
    spiegazione: `Dalla home si può ${elenco(ci)}, ma manca ${elenco(manca)}.`,
    rimedio: `Aggiungi ${elenco(manca)}: un link tel: per il numero, mailto: per l'email, wa.me per WhatsApp.`,
  };
}

function fuoriOrario(r: Rilevamenti) {
  const modulo = moduloPrincipale(r);
  const dove = modulo ? (modulo.pagina === "contatti" ? "nella pagina contatti" : "nella home") : "";
  const conChat = r.chat.length > 0;
  if (r.plugin) {
    return {
      spiegazione: `Sul sito c'è già ${PLUGIN_NAME}: chi scrive di notte riceve una risposta subito.`,
      rimedio: "Niente da sistemare. Tieni aggiornate le risposte con le domande che ricevi più spesso.",
    };
  }
  const nomeModulo = modulo ? `un modulo ${dove}` : r.moduloEsterno ? `un modulo (${r.moduloEsterno})` : "";
  const rimedioPlugin = r.wordpress
    ? `Con ${PLUGIN_NAME}, gratuito per WordPress, chi scrive fuori orario riceve subito una risposta e la richiesta ti arriva completa.`
    : "Un assistente che risponde subito alle domande frequenti e raccoglie i recapiti evita che chi scrive di sera vada altrove.";
  if (nomeModulo && conChat) {
    return {
      spiegazione: `C'è ${nomeModulo} e una chat (${elenco(r.chat)}): di notte si può scrivere. Una chat che nessuno presidia, però, fuori orario risponde solo "ti ricontatteremo".`,
      rimedio: `Verifica cosa succede alle 22: se nessuno risponde, ${rimedioPlugin.charAt(0).toLowerCase()}${rimedioPlugin.slice(1)}`,
    };
  }
  if (nomeModulo) {
    return {
      spiegazione: `C'è ${nomeModulo}, nessuna chat: di notte si può scrivere, ma la risposta arriva solo il giorno dopo.`,
      rimedio: rimedioPlugin,
    };
  }
  if (conChat) {
    return {
      spiegazione: `C'è una chat (${elenco(r.chat)}) ma non abbiamo trovato un modulo di contatto: chi preferisce scrivere con calma non ha dove farlo.`,
      rimedio: "Aggiungi un modulo semplice nella pagina contatti (nome, email, messaggio).",
    };
  }
  return {
    spiegazione: r.paginaContatti
      ? "Né nella home né nella pagina contatti abbiamo trovato un modulo o una chat: fuori orario l'unica strada è un'email o una telefonata a vuoto."
      : "Nella home non abbiamo trovato un modulo, una chat né una pagina contatti: fuori orario non c'è modo di lasciare una richiesta.",
    rimedio: `Aggiungi un modulo di contatto. ${rimedioPlugin}`,
  };
}

function promessa(r: Rilevamenti) {
  const dove = r.paginaContatti ? "nella home e nella pagina contatti" : "nella home";
  if (r.promessa && r.orari) {
    return {
      spiegazione: `Indichi orari e tempi di risposta ${dove}: chi scrive sa cosa aspettarsi.`,
      rimedio: "Niente da sistemare. Mantieni la promessa: se dici 24 ore, rispondi entro 24 ore.",
    };
  }
  if (r.orari) {
    return {
      spiegazione: `Ci sono gli orari, ma ${dove} non abbiamo trovato una promessa sui tempi di risposta: chi scrive non sa quando avrà notizie.`,
      rimedio: 'Aggiungi vicino al modulo una frase come "Rispondiamo entro 24 ore lavorative".',
    };
  }
  if (r.promessa) {
    return {
      spiegazione: `Prometti tempi di risposta, ma ${dove} non abbiamo trovato gli orari.`,
      rimedio: "Aggiungi gli orari (ad esempio lun-ven 9:00-18:00) nella pagina contatti o nel footer.",
    };
  }
  return {
    spiegazione: `${dove.charAt(0).toUpperCase()}${dove.slice(1)} non abbiamo trovato né orari né una promessa sui tempi di risposta.`,
    rimedio: 'Scrivi gli orari e una promessa chiara, ad esempio "Rispondiamo entro 24 ore lavorative", vicino al modulo.',
  };
}

function telefono(r: Rilevamenti) {
  const modulo = moduloPrincipale(r);
  const parti: string[] = [];
  const rimedi: string[] = [];
  if (!r.viewport) {
    parti.push("la pagina non dichiara di adattarsi allo schermo del telefono (manca il meta viewport)");
    rimedi.push('aggiungi <meta name="viewport" content="width=device-width, initial-scale=1">');
  } else if (r.zoomBloccato) {
    parti.push("il sito si adatta al telefono ma blocca lo zoom, scomodo per chi legge male da vicino");
    rimedi.push("togli user-scalable=no e maximum-scale dal meta viewport");
  } else {
    parti.push("il sito si adatta al telefono e lascia fare lo zoom");
  }
  if (modulo === null) {
    parti.push("nessun modulo da valutare (non applicabile)");
  } else if (modulo.campi > MAX_CAMPI_TELEFONO) {
    parti.push(`il modulo ha ${modulo.campi} campi: da telefono molti si fermano prima di finire`);
    rimedi.push("riduci il modulo all'essenziale (nome, contatto, messaggio)");
  } else {
    parti.push(`il modulo ha ${modulo.campi} campi, compilabile anche da telefono`);
  }
  const testo = parti.join("; ");
  return {
    spiegazione: `${testo.charAt(0).toUpperCase()}${testo.slice(1)}. Controllo automatico su HTML: non sostituisce una prova dal tuo telefono.`,
    rimedio: rimedi.length
      ? `${rimedi.join("; ").charAt(0).toUpperCase()}${rimedi.join("; ").slice(1)}.`
      : "Niente da sistemare. Prova comunque a compilare il modulo dal tuo telefono.",
  };
}

function informativa(r: Rilevamenti) {
  const modulo = moduloPrincipale(r);
  const linkPrivacy =
    r.privacy === "footer"
      ? "C'è il link alla privacy nel footer"
      : r.privacy === "pagina"
        ? "C'è un link alla privacy nella home (non nel footer)"
        : "Nella home non abbiamo trovato un link alla privacy";
  const consenso =
    modulo === null
      ? "nessun modulo di cui valutare il consenso (non applicabile)"
      : modulo.consenso
        ? "il modulo chiede il consenso"
        : "il modulo non chiede il consenso al trattamento dei dati";
  const rimedi: string[] = [];
  if (!r.privacy) rimedi.push("metti il link all'informativa privacy nel footer di ogni pagina");
  if (modulo && !modulo.consenso) rimedi.push("aggiungi al modulo una casella di consenso non preselezionata con il link all'informativa");
  const rimedio = rimedi.join("; ");
  return {
    spiegazione: `${linkPrivacy}; ${consenso}.`,
    rimedio: rimedio ? `${rimedio.charAt(0).toUpperCase()}${rimedio.slice(1)}.` : "Niente da sistemare.",
  };
}

export function testiVoce(id: IdVoce, r: Rilevamenti, punti: number): { nome: string; spiegazione: string; rimedio: string } {
  const testi =
    id === "contatto"
      ? contatto(r, punti)
      : id === "fuori_orario"
        ? fuoriOrario(r)
        : id === "promessa"
          ? promessa(r)
          : id === "telefono"
            ? telefono(r)
            : informativa(r);
  return { nome: NOMI_VOCI[id], ...testi };
}
