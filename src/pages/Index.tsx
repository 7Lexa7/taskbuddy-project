import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();
  

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="CheckSquare" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskBuddy
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={() => navigate('/login')}>Войти</Button>
              <Button size="lg" onClick={() => navigate('/app')}>
                Попробовать бесплатно
              </Button>
            </div>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Умный менеджер задач для жизни и учёбы
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              TaskBuddy помогает организовать личные цели и учебные задачи в одном месте. 
              Приоритеты, напоминания, статистика — всё для вашей продуктивности.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => navigate('/app')}>
                <Icon name="Rocket" className="mr-2" size={20} />
                Начать бесплатно
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Icon name="Target" className="text-blue-600" size={24} />
                </div>
                <CardTitle>Два режима работы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Переключайтесь между "Личными целями" и "Учёбой" для разных контекстов жизни
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Icon name="Bell" className="text-purple-600" size={24} />
                </div>
                <CardTitle>Умные уведомления</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Напоминания в Telegram и на сайте, чтобы не пропустить важные дедлайны
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" className="text-green-600" size={24} />
                </div>
                <CardTitle>Статистика прогресса</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Отслеживайте продуктивность с наглядными графиками и диаграммами
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Icon name="Flag" className="text-red-600" size={24} />
                </div>
                <CardTitle>Приоритеты задач</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Три уровня приоритета: высокий 🔴, средний 🟡 и низкий 🟢
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Icon name="FolderKanban" className="text-orange-600" size={24} />
                </div>
                <CardTitle>Категории</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Группируйте задачи: Работа, Учёба, Дом, Личное, Проекты
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <Icon name="Repeat" className="text-pink-600" size={24} />
                </div>
                <CardTitle>Повторы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Автоматическое создание повторяющихся задач и привычек
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2025 TaskBuddy. Умный помощник для ваших задач.</p>
          </div>
        </footer>
      </div>
  );
};

export default Index;