import { useState } from "react"

function Dashboard() {
    const [english, setEnglish] = useState(true)

    return (
        <div className="it">
            <button className="finishBtn"
                onClick={() => {
                    setEnglish(!english)
                }}
            >
                {english ? "فارسی" : "English"}
            </button>

            {
                english ? (
                    <div>
                        <p className="ss">
                            I have experience designing RESTful APIs, implementing authentication and authorization with JWT, working with databases, and building responsive user interfaces I also enjoy learning about application security, performance optimization, and writing clean, maintainable, and scalable code Every project I build is an opportunity to learn something new and improve my development workflow
                        </p>

                        <p className="ss">
                            I'm always exploring new technologies, best practices, and modern development tools to become a better software engineer My goal is to create high-quality applications, contribute to meaningful projects, and continue growing through learning, collaboration, and real-world experience
                        </p>

                        <p className="ss">
                            Outside of coding, I enjoy exploring new technologies, reading technical documentation, and experimenting with different tools and frameworks to expand my knowledge I believe that consistency and curiosity are the keys to becoming a better developer, so I dedicate time to learning something new whenever possible
                        </p>

                        <p className="ss">
                            I enjoy working on personal projects because they allow me to apply what I learn in real-world scenarios and improve my understanding of software architecture and development practices I value writing organized code, solving challenging problems, and building applications that are both functional and easy to maintain
                        </p>

                        <p className="ss">
                            I'm interested in continuous self-improvement and enjoy collaborating with other developers, sharing ideas, and learning from different perspectives My long-term goal is to contribute to impactful software projects, keep growing as a full-stack developer, and stay up to date with the latest technologies in the software development industry
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="ss2">
                            من امیر هستم، یک توسعه‌دهنده نرم‌افزار مشتاق که از ساخت برنامه‌های تحت وب و یادگیری فناوری‌های جدید لذت می‌برم تجربه کار با جاوااسکریپت، تایپ‌اسکریپت، ری‌اکت، نود جی اس، اکسپرس، پستگرس‌کیوال و مونگو‌دی‌بی را دارم به نوشتن کدهای تمیز و قابل‌نگهداری علاقه دارم و هم‌زمان برای ارتقای مداوم مهارت‌هایم در هر دو حوزه فرانت‌اند و بک‌اند تلاش می‌کنم
                        </p>

                        <p className="ss2">
                            تجربه طراحی رابط‌های برنامه‌نویسی کاربردی مبتنی بر انتقال وضعیت، پیاده‌سازی احراز هویت و تعیین سطح دسترسی با استفاده از توکن وب جیسون، کار با پایگاه‌های داده و ساخت رابط‌های کاربری واکنش‌گرا را دارم همچنین از یادگیری مباحثی همچون امنیت نرم‌افزار، بهینه‌سازی عملکرد و نوشتن کدهای تمیز، قابل‌نگهداری و مقیاس‌پذیر لذت می‌برم
                        </p>

                        <p className="ss2">
                            همواره در حال کاوش فناوری‌های جدید، بهترین روش‌های توسعه و ابزارهای مدرن هستم تا به مهندس نرم‌افزار بهتری تبدیل شوم هدف من خلق برنامه‌های باکیفیت، مشارکت در پروژه‌های ارزشمند و ادامه مسیر رشد از طریق یادگیری، همکاری و کسب تجربه در دنیای واقعی است
                        </p>

                        <p className="ss2">
                            در کنار کدنویسی، از بررسی فناوری‌های نوظهور، مطالعه مستندات فنی و کار با ابزارها و چارچوب‌های مختلف برای گسترش دانش خود لذت می‌برم معتقدم که استمرار و کنجکاوی کلیدهای تبدیل شدن به یک توسعه‌دهنده بهتر هستند
                        </p>

                        <p className="ss2">
                            کار روی پروژه‌های شخصی را دوست دارم، زیرا به من اجازه می‌دهند آموخته‌هایم را در سناریوهای واقعی به کار بگیرم و درک خود را از معماری نرم‌افزار و روش‌های توسعه ارتقا دهم
                        </p>

                        <p className="ss2">
                            به رشد و پیشرفت فردی مداوم علاقه‌مندم و از همکاری با سایر توسعه‌دهندگان، تبادل ایده‌ها و یادگیری از دیدگاه‌های گوناگون لذت می‌برم هدف بلندمدت من ادامه مسیر رشد به عنوان یک توسعه‌دهنده تمام‌پشته و به‌روز ماندن با جدیدترین فناوری‌های صنعت توسعه نرم‌افزار است
                        </p>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard