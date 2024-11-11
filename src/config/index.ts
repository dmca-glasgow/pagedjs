import { HeaderFooter } from "./header-footer";
import { Paper, Size } from "./paper";
import { Breaks } from './breaks'

export type Config = {
  paper: Paper,
  headerFooter: HeaderFooter,
  breaks: Breaks,
}

export const config: Config = {
  paper: {
    selectedSize: Size.A4,
    sizes: {
      A4: {
        width: '210mm',
        height: '297mm'
      },
      Letter: {
        width: '8.5in',
        height: '11in'
      },
      Legal: {
        width: '8.5in',
        height: '14in'
      }
    }
  },
  headerFooter: {
    header: {
      center: {
        type: 'text',
        value: 'Complex Analysis'
      }
    },
    footer: {
      left: {
        type: 'chapter-title',
        titleSelector: 'h2',
      },
      right: {
        type: 'page-number',
        template: (num, total = 0) => `Page ${num} of ${total}`
      }
    },
    firstPage: {
      footer: {
        center: {
          type: 'page-number',
          template: (num, total = 0) => `Page ${num} of ${total}`
        }
      }
    }
  },
  breaks: {
    "h2": [
      {
        "property": "break-before",
        "value": "always",
      }
    ],
    "h3": [
      {
        "property": "break-after",
        "value": "avoid",
      }
    ],
    "h4": [
      {
        "property": "break-after",
        "value": "avoid",
      }
    ],
    "h5": [
      {
        "property": "break-after",
        "value": "avoid",
      }
    ],
    "h6": [
      {
        "property": "break-after",
        "value": "avoid",
      }
    ],
    ".boxout .type": [
      {
        "property": "break-after",
        "value": "avoid",
      }
    ],
    ".boxout .proof-box": [
      {
        "property": "break-before",
        "value": "avoid",
      }
    ]
  }
}
