package model.dao.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
public class Conexao {
    private static Connection connection;

    /**
     * @return
     */
    public static Connection getConnection() {
        if (connection == null) {
            try {
                // Configurações de conexão com o banco de dados
                String url = "jdbc:mysql://localhost:3306/seu_banco_de_dados";
                String username = "seu_usuario";
                String password = "sua_senha";

                // Estabelece a conexão
                connection = DriverManager.getConnection(url, username, password);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return connection;
    }
}