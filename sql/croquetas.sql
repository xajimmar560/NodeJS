-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 27-01-2026 a las 18:37:43
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `croquetas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `croqueta`
--

CREATE TABLE `croqueta` (
  `nombre` varchar(255) NOT NULL,
  `creacion` date NOT NULL,
  `precio` double NOT NULL,
  `receta` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `croqueta`
--

INSERT INTO `croqueta` (`nombre`, `creacion`, `precio`, `receta`) VALUES
('Brochetas de croquetas completamente comestibles', '2026-01-31', 3.5, 2),
('Croqueta con bechamel de queso', '2025-01-30', 3, 1),
('Croqueta italiana con pizza en la bechamel y boloñesa por encima', '2025-06-07', 6.7, 3),
('Croquetas roulette con una posibilidad de llevar tabasco para los atrevidos', '2025-06-09', 3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingrediente`
--

CREATE TABLE `ingrediente` (
  `ingrediente` varchar(255) NOT NULL,
  `receta` int NOT NULL COMMENT 'La receta de la que forma parte',
  `preprocesado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ingrediente`
--

INSERT INTO `ingrediente` (`ingrediente`, `receta`, `preprocesado`) VALUES
('Boloñesa para croquetas', 3, 0),
('Palillo de brocheta comestible', 2, 1),
('Pizza de pepperoni italiana', 3, 0),
('Queso filadelfia para la bechamel', 1, 1),
('Queso semicurado del mercadona', 1, 1),
('Tabasco para una croqueta de la tapa roulette', 4, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `croqueta`
--
ALTER TABLE `croqueta`
  ADD PRIMARY KEY (`nombre`),
  ADD KEY `recetafk` (`receta`);

--
-- Indices de la tabla `ingrediente`
--
ALTER TABLE `ingrediente`
  ADD PRIMARY KEY (`ingrediente`,`receta`) USING BTREE,
  ADD KEY `recetaindice` (`receta`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `croqueta`
--
ALTER TABLE `croqueta`
  ADD CONSTRAINT `recetafk` FOREIGN KEY (`receta`) REFERENCES `ingrediente` (`receta`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
