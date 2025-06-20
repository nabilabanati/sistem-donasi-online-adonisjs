import { JQueryStatic } from 'jquery'
import type { DataTable } from 'datatables.net'
import type { Dropzone } from 'dropzone'
import noUiSlider from 'nouislider'
import * as VanillaCalendarPro from 'vanilla-calendar-pro'
import type { IStaticMethods } from 'preline/dist'

declare global {
  interface Window {
    // Optional third-party libraries
    _: typeof import('lodash')
    $: JQueryStatic
    jQuery: JQueryStatic
    DataTable: typeof DataTable
    Dropzone: typeof Dropzone
    noUiSlider: typeof noUiSlider
    VanillaCalendarPro: typeof VanillaCalendarPro

    // Preline UI
    HSStaticMethods: IStaticMethods
  }
}