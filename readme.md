#Crear la base de datos:
npx sequelize-cli db:create

#Ejecutar migraciones:
npx sequelize-cli db:migrate

#Ejecutar seeds:
npx sequelize-cli db:seed:all