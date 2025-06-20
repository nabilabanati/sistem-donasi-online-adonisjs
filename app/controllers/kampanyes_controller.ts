import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'


export default class KampanyesController {
    public async index({ view }: HttpContext) {
        const kampanyes = await Kampanye.query().preload('kategori')
        return view.render('pages/kampanye/index', { kampanyes })
    }
    
    public async create({ view }: HttpContext) {
        const kategoris = await Kategori.all()
        return view.render('pages/kampanye/create', { kategoris })
    }
    
    public async save({ request, response }: HttpContext) {
        const data = request.only(['namaKampanye', 'kategoriId', 'target'])
        await Kampanye.create(data)
        response.redirect().toRoute('kampanye.index')
    }
    
    public async show({ view, params }: HttpContext) {
        const kampanye = await Kampanye.query()
        .where('id', params.id)
        .preload('kategori')
        .firstOrFail()
        return view.render('pages/kampanye/show', { kampanye })
    }
    
    public async edit({ view, params }: HttpContext) {
        const kampanye = await Kampanye.findOrFail(params.id)
        const kategoris = await Kategori.all()
        return view.render('pages/kampanye/edit', { kampanye, kategoris })
    }
    
    public async update({ request, response, params }: HttpContext) {
        const kampanye = await Kampanye.findOrFail(params.id)
        const data = request.only(['namaKampanye', 'kategoriId', 'target'])
        kampanye.merge(data)
        await kampanye.save()
        response.redirect().toRoute('kampanye.index')
    }
    
    public async destroy({ response, params }: HttpContext) {
        const kampanye = await Kampanye.findOrFail(params.id)
        await kampanye.delete()
        response.redirect().toRoute('kampanye.index')
    }
}