import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Icon name="CheckSquare" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold gradient-text">
              TaskBuddy
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" onClick={() => navigate('/app')}>
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/60 backdrop-blur-sm rounded-full border shadow-sm">
            <Icon name="Sparkles" size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Новое поколение планирования</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Умный менеджер</span>
            <br />
            <span className="text-foreground">для жизни и учёбы</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            TaskBuddy объединяет личные цели и учебные задачи в едином пространстве. 
            Приоритеты, календарь, статистика — всё для максимальной продуктивности.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all" onClick={() => navigate('/app')}>
              <Icon name="Rocket" className="mr-2" size={20} />
              Начать бесплатно
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/login')}>
              <Icon name="LogIn" className="mr-2" size={20} />
              Войти в аккаунт
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Без кредитной карты</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Бесплатный тариф навсегда</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Без рекламы</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Всё необходимое для продуктивности
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Мощные функции, которые помогают управлять задачами эффективнее
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:shadow-xl hover:border-blue-200 transition-all animate-scale-in">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="Target" className="text-blue-600" size={24} />
              </div>
              <CardTitle className="text-xl">Два режима работы</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Легко переключайтесь между "Личными целями" и "Учёбой" для эффективного управления разными сферами жизни
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:border-purple-200 transition-all animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="Calendar" className="text-purple-600" size={24} />
              </div>
              <CardTitle className="text-xl">Календарь и дедлайны</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Визуализация задач в календаре, умные напоминания и отслеживание приближающихся сроков
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:border-green-200 transition-all animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="TrendingUp" className="text-green-600" size={24} />
              </div>
              <CardTitle className="text-xl">Статистика прогресса</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Детальная аналитика продуктивности с графиками выполнения и трекингом достижений
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:border-red-200 transition-all animate-scale-in" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="Flag" className="text-red-600" size={24} />
              </div>
              <CardTitle className="text-xl">Система приоритетов</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Три уровня важности (высокий 🔴, средний 🟡, низкий 🟢) помогают фокусироваться на главном
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:border-orange-200 transition-all animate-scale-in" style={{animationDelay: '0.4s'}}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="FolderKanban" className="text-orange-600" size={24} />
              </div>
              <CardTitle className="text-xl">Гибкие категории</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Организуйте задачи по категориям: Работа 💼, Учёба 🎓, Дом 🏠, Личное 👤, Проекты 📁
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl hover:border-pink-200 transition-all animate-scale-in" style={{animationDelay: '0.5s'}}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-4 shadow-md">
                <Icon name="Zap" className="text-pink-600" size={24} />
              </div>
              <CardTitle className="text-xl">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Моментальное создание, редактирование и фильтрация задач с удобным интерфейсом
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
            <CardContent className="p-12 text-center">
              <Icon name="Sparkles" size={48} className="mx-auto mb-6 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Готовы стать продуктивнее?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам пользователей, которые уже управляют своими задачами с TaskBuddy
              </p>
              <Button size="lg" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl" onClick={() => navigate('/app')}>
                <Icon name="ArrowRight" className="mr-2" size={20} />
                Начать прямо сейчас
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-12 mt-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="CheckSquare" className="text-white" size={18} />
              </div>
              <span className="font-bold gradient-text">TaskBuddy</span>
            </div>
            <p className="text-muted-foreground">© 2025 TaskBuddy. Умный помощник для ваших задач.</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">О нас</Button>
              <Button variant="ghost" size="sm">Помощь</Button>
              <Button variant="ghost" size="sm">Контакты</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
