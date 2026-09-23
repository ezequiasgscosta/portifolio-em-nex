
# Portfólio

## Gerenciador protegido

1. No Supabase SQL Editor, execute [`supabase/schema.sql`](supabase/schema.sql).
2. Em **Authentication > Users**, crie o usuário que poderá administrar o site.
3. No SQL Editor, autorize esse usuário substituindo o e-mail abaixo:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'seu-email@exemplo.com';
```

4. Abra o popup **Lazer** no site e entre com esse e-mail e senha.

O painel permite adicionar, editar e excluir projetos com IA, projetos sem IA e certificados. A imagem pode ser um link ou um arquivo local de até 2 MB. Arquivos locais são convertidos e armazenados na tabela `portfolio_items`; os dados ficam protegidos pelas políticas RLS do schema.
