conn=`cat conn_database.txt`
echo "Initializing databases..."
psql "$conn" -f init_database.sql

echo "DONE!!! Happy coding :)"