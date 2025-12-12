import Review from "../Reviews/Review";
import "./BlogDetail.css";

const BlogDetail = () => {
  return (
    <section className="single-blog">
      <div className="container">
        <article>
          <figure>
            <a href="#">
              <img src="/img/blogs/blog1.jpg" alt="" />
            </a>
          </figure>
          <div className="blog-wrapper">
            <div className="blog-meta">
              <div className="blog-category">
                <a href="#">Koleksiyonlar</a>
              </div>
              <div className="blog-date">
                <a href="#">18 Ekim, 2025</a>
              </div>
              <div className="blog-tags">
                <a href="#">Ürünler</a>,<a href="#">sweatshirts</a>
              </div>
            </div>
            <h1 className="blog-title">Sweatshirts</h1>
            <div className="blog-content">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus tempore hic dolorum quasi temporibus sapiente
                placeat ut voluptatibus laborum ullam suscipit optio eos, omnis
                distinctio vitae deserunt odit. Alias veritatis quasi
                consequuntur. Ducimus praesentium voluptatum expedita totam
                nulla quis, numquam aliquid neque consequuntur pariatur? Sed cum
                vel et iusto repellendus.
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus
                unde repellat exercitationem id vitae distinctio porro, impedit
                reiciendis voluptate! Ipsam repudiandae animi natus deserunt?
                Sunt nam, blanditiis illo odio accusamus dolores magnam
                repudiandae. Recusandae alias itaque qui tenetur quis, quo eos
                delectus enim excepturi ad perferendis fuga cupiditate
                doloremque maxime voluptate odit veniam pariatur temporibus,
                dolores natus, voluptas ipsa praesentium accusamus eligendi.
                Assumenda, aliquam at! Voluptatum, iste recusandae molestias
                sequi ipsam voluptas quia placeat dolor?
              </p>

              <blockquote>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Iste, vitae.
                </p>
              </blockquote>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                explicabo praesentium totam perspiciatis minima, assumenda,
                voluptate tempora, tempore iste animi optio distinctio facilis
                inventore voluptates commodi aliquid hic asperiores eum ea.
                Sequi placeat, eaque culpa praesentium quo facere voluptatibus
                optio. Optio incidunt ducimus quos, velit numquam id aut.
                Deleniti, ut.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci mollitia corrupti magnam tempora natus dolor reiciendis
                architecto amet, dolores sit possimus excepturi numquam
                nesciunt? Modi laboriosam, dolor architecto eius veniam labore
                blanditiis, sapiente repellat doloremque eaque quod nam
                provident ullam iusto rerum excepturi amet! Excepturi voluptas
                repudiandae laudantium rem eveniet.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
                quasi aliquam rerum nemo omnis. Perferendis vel nam earum
                blanditiis dolore?
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                iusto modi repudiandae consequuntur optio dolor iste, ratione in
                a commodi quisquam porro ducimus inventore asperiores est cum
                enim doloremque officia.
              </p>
            </div>
          </div>
        </article>
        <Review />
      </div>
    </section>
  );
};

export default BlogDetail;
