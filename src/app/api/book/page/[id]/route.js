import Book from "@/models/Book";
import connect from "@/lib/db";

export async function GET(req, ctx) {
    // Sayfa sayısını url'den alıyoruz. Eğer url'de sayfa numarası yoksa 1. sayfayı gösterir.
    const page = ctx.params.id ? parseInt(ctx.params.id) : 1;

    // Bir sayfada kaç adet kitap gösterileceğini belirliyoruz.
    const perPage = 10;

    await connect();

    try {
        // Toplam kitap sayısını alıyoruz.
        const totalCount = await Book.countDocuments();

        // Toplam kitap sayısına göre oluşacak sayfa sayısını hesaplıyoruz.
        const totalPages = Math.ceil(totalCount / perPage);

        // skip: Sorgudan önce kaç kitap atlanacağını belirler.
        // (page - 1) * perPage -> page = 1 için 0, page = 2 için 10, page = 3 için 20, kitap atlanır.
        // limit: Sorgudan kaç kitap alınacağını belirler.
        const books = await Book.find({})
            .populate("user")
            .skip((page - 1) * perPage)
            .limit(perPage);

        return new Response(
            JSON.stringify({ books, totalPages, currentPage: page, perPage }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}
