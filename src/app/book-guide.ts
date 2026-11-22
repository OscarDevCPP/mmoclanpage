import type { BookSection } from './book-content';

/** Existing Singles guide, represented once independently of its physical leaves. */
export const BOOK_GUIDE: readonly BookSection[] = [
  {
    "id": "introduccion-competitivo",
    "blocks": [
      {
        "kind": "heading",
        "id": "introduccion-competitivo-1",
        "level": 2,
        "runs": [
          {
            "text": "Introducción al competitivo",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-competitivo-2",
        "runs": [
          {
            "text": "Si conoces PokeMMO por la historia y quieres probar combates contra otras personas, aquí aprenderás a leer un turno y reconocer un plan sencillo.",
            "marks": []
          }
        ]
      },
      {
        "kind": "heading",
        "id": "introduccion-competitivo-3",
        "level": 3,
        "runs": [
          {
            "text": "¿Qué es competir?",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-competitivo-4",
        "runs": [
          {
            "text": "En PvP (",
            "marks": []
          },
          {
            "text": "player versus player",
            "marks": [
              {
                "kind": "emphasis"
              }
            ]
          },
          {
            "text": ", jugador contra jugador), tu rival también toma decisiones: cambia de Pokémon, protege piezas importantes y trata de anticipar tus jugadas. En ",
            "marks": []
          },
          {
            "text": "Singles",
            "marks": [
              {
                "kind": "strong"
              }
            ]
          },
          {
            "text": ", cada entrenador tiene un Pokémon activo frente a uno del rival. Existen otros formatos, como Doubles y Randoms, pero esta ruta empieza por Singles.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-competitivo-5",
        "runs": [
          {
            "text": "La meta es ganar bajo las reglas del combate, habitualmente dejando sin Pokémon disponibles al rival. No se trata solo de golpear fuerte: también importa cuándo atacar, cuándo cambiar y qué guardar para después.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-competitivo-6",
        "runs": [
          {
            "text": "En la historia puedes resolver encuentros avanzando y aprovechando niveles. En competitivo te enfrentas a alguien que prepara respuestas y adapta su plan. Perder no significa empezar de cero: revisar una decisión puede enseñar más que cambiar todo el equipo.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "introduccion-turno",
    "blocks": [
      {
        "kind": "heading",
        "id": "introduccion-turno-1",
        "level": 2,
        "runs": [
          {
            "text": "Un turno, varias preguntas",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-turno-2",
        "runs": [
          {
            "text": "Cada turno eliges una acción disponible, como usar un movimiento o cambiar de Pokémon. El rival hace lo mismo. Las acciones se resuelven según prioridad, velocidad y efectos; no supongas que actuarás primero. Un cambio puede proteger una pieza, pero quien entra también recibe las consecuencias de la acción rival.",
            "marks": []
          }
        ]
      },
      {
        "kind": "diagram",
        "id": "introduccion-turno-diagrama",
        "description": "Comprobar la amenaza y seguridad, comparar ataque o cambio, resolver y ajustar"
      },
      {
        "kind": "paragraph",
        "id": "introduccion-turno-4",
        "runs": [
          {
            "text": "Considera la amenaza, si puedes actuar con seguridad y el riesgo antes de elegir. Si tu atacante es importante para el final, quizá convenga conservarlo; cambiar a ciegas también puede poner en peligro a su compañero.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "introduccion-plan",
    "blocks": [
      {
        "kind": "heading",
        "id": "introduccion-plan-1",
        "level": 2,
        "runs": [
          {
            "text": "Un equipo con un plan",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-plan-2",
        "runs": [
          {
            "text": "Una pieza puede presionar; otra, resistir o recuperar salud; otra, facilitar la entrada de sus compañeros. Una pieza puede cumplir varias funciones y una función puede repartirse entre varias.",
            "marks": []
          }
        ]
      },
      {
        "kind": "diagram",
        "id": "introduccion-plan-diagrama",
        "description": "Apoyo facilita la entrada del atacante y defensa cubre amenazas para conservarlo"
      },
      {
        "kind": "paragraph",
        "id": "introduccion-plan-4",
        "runs": [
          {
            "text": "El apoyo facilita la entrada del atacante y la defensa cubre amenazas. Es un plan posible, no una receta obligatoria. Una ",
            "marks": []
          },
          {
            "text": "condición de victoria",
            "marks": [
              {
                "kind": "strong"
              }
            ]
          },
          {
            "text": " (",
            "marks": []
          },
          {
            "text": "win condition",
            "marks": [
              {
                "kind": "emphasis"
              }
            ]
          },
          {
            "text": ") es la situación que intentas crear para ganar: por ejemplo, conservar al atacante hasta debilitar sus obstáculos. Si el rival lo impide, adapta el plan.",
            "marks": []
          }
        ]
      },
      {
        "kind": "heading",
        "id": "introduccion-plan-5",
        "level": 3,
        "runs": [
          {
            "text": "Formatos y tiers",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-plan-6",
        "runs": [
          {
            "text": "Un formato define la modalidad y reglas del combate. Una tier organiza la competencia según criterios definidos; OU, UU y NU son ejemplos de categorías. Sus reglas y restricciones pueden cambiar: consulta el formato concreto. Más uso no significa más poder en cualquier situación.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "introduccion-practica",
    "blocks": [
      {
        "kind": "heading",
        "id": "introduccion-practica-1",
        "level": 2,
        "runs": [
          {
            "text": "Antes de combatir",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-practica-2",
        "runs": [
          {
            "text": "Comprueba la elegibilidad, que movimientos, habilidades y objetos apoyen las funciones y que entiendas las debilidades. Los IV son valores individuales y los EV representan entrenamiento: no necesitas seis IV perfectos en cada miembro como requisito universal. Empieza con objetivos alcanzables.",
            "marks": []
          }
        ]
      },
      {
        "kind": "list",
        "id": "introduccion-practica-3",
        "ordered": false,
        "items": [
          {
            "id": "introduccion-practica-3-1",
            "runs": [
              {
                "text": "Elegí formato y revisé reglas y elegibilidad.",
                "marks": []
              }
            ]
          },
          {
            "id": "introduccion-practica-3-2",
            "runs": [
              {
                "text": "Sé qué hace cada miembro y cuál conservar.",
                "marks": []
              }
            ]
          },
          {
            "id": "introduccion-practica-3-3",
            "runs": [
              {
                "text": "Identifico una amenaza y un cambio posible.",
                "marks": []
              }
            ]
          },
          {
            "id": "introduccion-practica-3-4",
            "runs": [
              {
                "text": "Mis movimientos, habilidades y objetos apoyan el plan.",
                "marks": []
              }
            ]
          },
          {
            "id": "introduccion-practica-3-5",
            "runs": [
              {
                "text": "Revisaré una decisión después del combate.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "kind": "heading",
        "id": "introduccion-practica-4",
        "level": 3,
        "runs": [
          {
            "text": "Mini ejercicio",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-practica-5",
        "runs": [
          {
            "text": "Tu atacante debe cerrar el combate, pero el rival amenaza con debilitarlo. Un compañero resistente podría entrar. ¿Qué preguntas antes de actuar?",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-practica-6",
        "runs": [
          {
            "text": "Respuesta:",
            "marks": [
              {
                "kind": "strong"
              }
            ]
          },
          {
            "text": " ¿qué puede hacer el rival y qué riesgo corre el compañero al entrar? Si el cambio conserva al atacante sin sacrificar una pieza esencial, puede ayudar; si no, evalúa otra acción. Sin conocer movimientos y salud no hay una única respuesta garantizada.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "introduccion-practica-7",
        "runs": [
          {
            "text": "Fuentes conceptuales: ",
            "marks": []
          },
          {
            "text": "Getting Started",
            "marks": [
              {
                "kind": "link",
                "href": "https://www.smogon.com/articles/getting-started"
              }
            ]
          },
          {
            "text": ", ",
            "marks": []
          },
          {
            "text": "Synergies and Cores",
            "marks": [
              {
                "kind": "link",
                "href": "https://www.smogon.com/xy/articles/synergy"
              }
            ]
          },
          {
            "text": " y ",
            "marks": []
          },
          {
            "text": "Teambuilding",
            "marks": [
              {
                "kind": "link",
                "href": "https://www.smogon.com/smog/issue28/teambuilding"
              }
            ]
          },
          {
            "text": " de Smogon. No acreditan legalidad actual en PokeMMO. Versión del cliente no comprobada.",
            "marks": []
          }
        ]
      }
    ]
  }
];
