import type { GuideSection, GuideBlock } from './guide-content';
import { PILLARS } from './pillars-data';

export const PVE_GUIDE: readonly GuideSection[] = [
  {
    "id": "preparacion",
    "blocks": [
      {
        "kind": "heading",
        "id": "pve-block-1",
        "level": 2,
        "runs": [
          {
            "text": "Introducción",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-2",
        "runs": [
          {
            "text": "Las revanchas de gimnasio son combates dobles contra líderes ya vencidos. Los seis pilares es una estrategia avanzada para recorrer varias revanchas de gimnasio con un mismo equipo. Combina ataques de área, cambios y respuestas a distintas aperturas para resolver esos combates; no todos tienen que seguir el mismo plan.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-3",
        "runs": [
          {
            "text": "La fuente recomienda completar las cinco regiones para aprovechar toda la ruta y empezar con estrategias más sencillas antes de invertir en este equipo. Antes de comprar, revisa qué gimnasios incluye la ruta elegida y prepara los movimientos, objetos y valores que necesita. Calcula el coste de crianza, movimientos y objetos según el mercado actual. Lleva un objeto que aumente las ganancias y compara su precio con el beneficio esperado: las cifras de la guía original son estimaciones, no garantías.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "equipo",
    "blocks": [
      {
        "kind": "heading",
        "id": "pve-block-4",
        "level": 2,
        "runs": [
          {
            "text": "El equipo",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-5",
        "runs": [
          {
            "text": "Los seis pilares se complementan: Typhlosion y Blastoise atacan con Estallido y Salpicar, movimientos cuya potencia depende de sus PS; Weezing puede usar Explosión para dar entrada a otra pareja. Togekiss acompaña a Garchomp, mientras Vanilluxe aporta Ventisca y cambia el clima.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-6",
        "runs": [
          {
            "text": "Consulta la ",
            "marks": []
          },
          {
            "text": "configuración del equipo enlazada por la guía original",
            "marks": [
              {
                "kind": "link",
                "href": "https://pokepast.es/f00df8948e58939c"
              }
            ]
          },
          {
            "text": " y las condiciones de tu ruta antes de criar.",
            "marks": []
          }
        ]
      },
      {
        "kind": "builds",
        "id": "pve-block-7", "builds": PILLARS
      },
      {
        "kind": "paragraph",
        "id": "pve-block-8",
        "runs": [
          {
            "text": "La guía recomienda maximizar los PP de Estallido, Salpicar, Vozarrón, Ventisca de Vanilluxe y Terremoto. Comprueba con una calculadora de daño en dobles que Explosión debilite al compañero cuando tu secuencia lo requiera: los IV y la naturaleza cambian el resultado.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "estrategia",
    "blocks": [
      {
        "kind": "heading",
        "id": "pve-block-9",
        "level": 2,
        "runs": [
          {
            "text": "La idea principal",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-10",
        "runs": [
          {
            "text": "Antes de cada combate, mira la apertura indicada en tu ruta y reconoce al rival. La idea es elegir la pareja inicial y el movimiento según el líder y sus Pokémon, no repetir una combinación a ciegas. Por ejemplo, Blastoise puede atacar primero y Weezing usar Explosión después: si ambos se debilitan, entran otros dos compañeros. En otras aperturas, Sorpresa detiene una amenaza y Vanilluxe cambia el clima al entrar. Togekiss puede apoyar con Refuerzo o atacar junto al Terremoto de Garchomp sin recibir ese movimiento. Si Blastoise o Typhlosion pierden PS, sus ataques de área pierden potencia; cura al equipo cuando la ruta lo indique y adapta la jugada si el combate no sale como estaba previsto.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "basica",
    "blocks": [
      {
        "kind": "heading",
        "id": "pve-block-11",
        "level": 2,
        "runs": [
          {
            "text": "Ruta básica y avanzadas",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-12",
        "runs": [
          {
            "text": "Una ruta te indica en qué orden visitar los gimnasios y qué hacer en cada combate. Como las rutas pueden cambiar, enlazamos a sus publicaciones originales, donde normalmente encontrarás la versión más reciente. Antes de empezar una ronda, abre la ruta que quieras seguir y revisa allí el recorrido, el equipo y las instrucciones de cada turno.",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-13",
        "runs": [
          {
            "text": "Las instrucciones están en inglés. Si ves ",
            "marks": []
          },
          {
            "text": "swap",
            "marks": [
              {
                "kind": "italic"
              },
              {
                "kind": "language",
                "value": "en"
              }
            ]
          },
          {
            "text": ", cambia al Pokémon indicado; si se menciona un objeto equipado, cambia ese objeto. ",
            "marks": []
          },
          {
            "text": "Held item",
            "marks": [
              {
                "kind": "italic"
              },
              {
                "kind": "language",
                "value": "en"
              }
            ]
          },
          {
            "text": " se refiere al objeto que lleva equipado un Pokémon. Si ves ",
            "marks": []
          },
          {
            "text": "use",
            "marks": [
              {
                "kind": "italic"
              },
              {
                "kind": "language",
                "value": "en"
              }
            ]
          },
          {
            "text": " seguido del nombre de un movimiento o un objeto, úsalo en ese turno. ",
            "marks": []
          },
          {
            "text": "X.Items",
            "marks": [
              {
                "kind": "italic"
              },
              {
                "kind": "language",
                "value": "en"
              }
            ]
          },
          {
            "text": " se refiere a los objetos de combate que aumentan temporalmente una característica, como Ataque X.",
            "marks": []
          }
        ]
      },
      {
        "kind": "tip",
        "id": "pve-block-14",
        "title": "Recomendación",
        "runs": [
          {
            "text": "Para estimar cuánto ganarías con tu ruta, abre ",
            "marks": []
          },
          {
            "text": "PokeMMO Hub",
            "marks": [
              {
                "kind": "link",
                "href": "https://pokemmohub.com/"
              }
            ]
          },
          {
            "text": " y selecciona ",
            "marks": []
          },
          {
            "text": "Gym Earnings Calculator",
            "marks": [
              {
                "kind": "strong"
              },
              {
                "kind": "language",
                "value": "en"
              }
            ]
          },
          {
            "text": ".",
            "marks": []
          }
        ]
      },
      {
        "kind": "heading",
        "id": "pve-block-15",
        "level": 3,
        "runs": [
          {
            "text": "Ruta básica",
            "marks": []
          }
        ]
      },
      {
        "kind": "paragraph",
        "id": "pve-block-16",
        "runs": [
          {
            "text": "Basic está pensada para aprender sin cambios de objeto ni X.Items. Consulta la ",
            "marks": []
          },
          {
            "text": "ruta básica completa",
            "marks": [
              {
                "kind": "link",
                "href": "https://docs.google.com/document/d/1cWYvyJ7JxlkQqnrIeLZj0l_Yra0JKMuT2dIPwGwNjGA/edit"
              }
            ]
          },
          {
            "text": " para el orden, las aperturas y sus excepciones; los siguientes ejemplos no sustituyen esa referencia.",
            "marks": []
          }
        ]
      },
      {
        "kind": "list",
        "id": "pve-block-17",
        "ordered": false,
        "items": [
          {
            "id": "pve-block-17-0",
            "runs": [
              {
                "text": "En Ciudad Azulona (Celadon), inicia con Blastoise y Weezing: Salpicar y Explosión; después, Estallido y Vozarrón. Ante Victreebel, la ruta indica terminar con Estallido y Garra Dragón.",
                "marks": []
              }
            ]
          },
          {
            "id": "pve-block-17-1",
            "runs": [
              {
                "text": "En Ciudad Arborada (Fortree), inicia con Blastoise y Weezing: Salpicar y Explosión, seguidos de Estallido y Vozarrón. Ante Swellow, usa Sorpresa sobre él junto a Explosión; después Ventisca y Vozarrón.",
                "marks": []
              }
            ]
          },
          {
            "id": "pve-block-17-2",
            "runs": [
              {
                "text": "En Pueblo Lavacalda (Lavaridge), Blastoise y Togekiss combinan Salpicar y Refuerzo; la ruta indica Vozarrón ante Houndoom o Arcanine de nivel 85. Cura si Blastoise ha recibido daño.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "kind": "subsection",
        "id": "variantes",
        "blocks": [
          {
            "kind": "heading",
            "id": "pve-block-19",
            "level": 3,
            "runs": [
              {
                "text": "Rutas avanzadas",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-20",
            "runs": [
              {
                "text": "Estas rutas modifican el recorrido o los recursos. Sus ejemplos dependen de la preparación y las condiciones de cada documento; consulta también sus excepciones antes de aplicarlos.",
                "marks": []
              }
            ]
          },
          {
            "kind": "heading",
            "id": "pve-block-21",
            "level": 4,
            "runs": [
              {
                "text": "Default",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-22",
            "runs": [
              {
                "text": "La ",
                "marks": []
              },
              {
                "text": "ruta Default",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/document/d/1-U3Hysu3bNvOufqCn1EzVRGza86Z5D269n9ZEbuMFpM/edit"
                  }
                ]
              },
              {
                "text": " utiliza X.Items. En Isla Canela (Cinnabar) propone como alternativa Salpicar y Especial X, seguidos de Salpicar y Buena Baza.",
                "marks": []
              }
            ]
          },
          {
            "kind": "heading",
            "id": "pve-block-23",
            "level": 4,
            "runs": [
              {
                "text": "Potential y Potential Plus",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-24",
            "runs": [
              {
                "text": "Potential",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/document/d/1-emmMge9AmmIBFESTLt-SDQYyx_fSECh2tIqB3UJiWk/edit"
                  }
                ]
              },
              {
                "text": ", de Zakr, amplía el recorrido y requiere X.Items; su documento pide ocarina de vuelo o saltar Arrecípolis (Sootopolis) o Pueblo Azalea (Azalea). En Ciudad Plateada (Pewter), ante Ludicolo o Aerodactyl, plantea Salpicar y Explosión, seguidos de Vozarrón y Terremoto; indica Garchomp Huraña para ese gimnasio opcional.",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-25",
            "runs": [
              {
                "text": "Potential Plus",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/document/d/1Hh0miob_zZeQ2f4GqFQd1tGvUx4TeUXXp9bMePFc6XY/edit"
                  }
                ]
              },
              {
                "text": " está orientada al uso de varios dispositivos. En Ciudad Petalia (Petalburg), ante Stantler o Blissey, comienza con Blastoise y Weezing usando Salpicar y Explosión, y continúa con Estallido y Vozarrón; la ruta indica curar después.",
                "marks": []
              }
            ]
          },
          {
            "kind": "heading",
            "id": "pve-block-26",
            "level": 4,
            "runs": [
              {
                "text": "Quickswap",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-27",
            "runs": [
              {
                "text": "Quickswap",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/document/d/19DmT92aXud24xmeedQCtlQWO8snRN7hE1qYm50p5lBA/edit"
                  }
                ]
              },
              {
                "text": " exige cambiar objetos durante el recorrido y practicar su gestión. Por ejemplo, tras Pueblo Lavacalda (Lavaridge) indica cambiar las Gafas Elegid de Togekiss por Pañuelo Elegido; tras Pueblo Azuliza (Dewford), volver a Gafas Elegid. La ruta también incluye Velocidad X en una respuesta a Electrode.",
                "marks": []
              }
            ]
          },
          {
            "kind": "heading",
            "id": "pve-block-28",
            "level": 4,
            "runs": [
              {
                "text": "Deadly Assault y Fixed-item",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-29",
            "runs": [
              {
                "text": "Deadly Assault",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/spreadsheets/d/1ajxlF_Qgl2k1-KYB-dvUW0VK8WEf3EDC/edit?gid=170801103"
                  }
                ]
              },
              {
                "text": " combina cambios de objeto y X.Items. Consulta la hoja para saber con qué Pokémon empezar cada combate, cuándo hacer un cambio y qué movimiento u objeto usar en cada turno.",
                "marks": []
              }
            ]
          },
          {
            "kind": "paragraph",
            "id": "pve-block-30",
            "runs": [
              {
                "text": "Fixed-item",
                "marks": [
                  {
                    "kind": "link",
                    "href": "https://docs.google.com/document/d/18iDlaTgwl7QozpBHzpcLJ3P3ceLzQQkqLVl-BRc4NZw/edit"
                  }
                ]
              },
              {
                "text": " es una referencia histórica de la primera versión. El propio documento advierte de cambios en febrero de 2024; úsalo para consultar cómo era la ruta original, no como itinerario actualizado.",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  }
];

export const PVE_FOOTER: readonly GuideBlock[] = [
  {
    "kind": "paragraph",
    "id": "pve-block-31",
    "runs": [
      {
        "text": "Adaptación de ",
        "marks": []
      },
      {
        "text": "6 Pillars: Gym Run Strategy",
        "marks": [
          {
            "kind": "link",
            "href": "https://docs.google.com/document/d/1XnFfsSVh1x5sEBLzvkletNfBuKY5ymSL_UHKNjoDaeE/edit?tab=t.0"
          }
        ]
      },
      {
        "text": ", de FreeReign, Mnoverick y Zakr, con actualización atribuida a CyanRenegade. Las rutas enlazadas contienen detalles y condiciones adicionales; la información y la economía del juego pueden cambiar.",
        "marks": []
      }
    ]
  },
  {
    "kind": "paragraph",
    "id": "pve-block-32",
    "runs": [
      {
        "text": "Guía original consultada el ",
        "marks": [
          {
            "kind": "emphasis"
          }
        ]
      },
      {
        "text": "26 de noviembre de 2026",
        "marks": [
          {
            "kind": "emphasis"
          },
          {
            "kind": "time",
            "datetime": "2026-11-26"
          }
        ]
      },
      {
        "text": ".",
        "marks": [
          {
            "kind": "emphasis"
          }
        ]
      }
    ]
  }
];
